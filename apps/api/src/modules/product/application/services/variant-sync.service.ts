import { Inject, Injectable, ConflictException } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { Product } from '../../domain/entities/product.entity';
import { Variant } from '../../domain/entities/variant.entity';

import { VariantRepository } from '../../domain/repositories/variant.repository';

import { QuantityVO } from '../../domain/value-objects/quantity.vo';

import { ProductSlugService } from './product-slug.service';
import { ProductSkuService } from './product-sku.service';
import { ProductPricingValidator } from './product-pricing.validator';
import { VariantImageService } from './variant-image.service';

@Injectable()
export class VariantSyncService {
  constructor(
    @Inject(TOKENS.VARIANT_REPO)
    private readonly variantRepo: VariantRepository,

    private readonly slugService: ProductSlugService,

    private readonly skuService: ProductSkuService,

    private readonly variantImageService: VariantImageService,
  ) {}

  async sync(
  product: Product,
  variants: any[] = [],
  tx?: any,
  options?: {
    preserveExistingVariants?: boolean;
  },
) {
  const preserveExistingVariants =
    options?.preserveExistingVariants ?? false;

  // ============================================================
  // EXISTING VARIANTS
  // ============================================================

  const existingVariants = await this.variantRepo.findByProduct(
    product.id,
    false,
    tx,
  );

  const existingAllVariants = await this.variantRepo.findByProduct(
    product.id,
    true,
    tx,
  );

  const existingById = new Map(
    existingAllVariants.map((variant) => [
      variant.id,
      variant,
    ]),
  );

  const existingBySku = new Map(
    existingAllVariants.map((variant) => [
      variant.sku.trim().toUpperCase(),
      variant,
    ]),
  );

  // ============================================================
  // ACTIVE PAYLOAD
  // ============================================================

  const activePayload = variants.filter(
    (variant) => !variant?.isDeleted,
  );

  // ============================================================
  // 🔥 NORMAL UPDATE BEHAVIOR
  //
  // If this is a normal product update, retain the existing
  // soft-delete behavior.
  //
  // IMPORT OVERRIDE sets preserveExistingVariants = true,
  // so old variants are NOT deleted.
  // ============================================================

  if (!preserveExistingVariants) {
    const payloadIds = new Set(
      activePayload
        .filter((variant) => variant?.id)
        .map((variant) => variant.id as string),
    );

    for (const existing of existingVariants) {
      if (!payloadIds.has(existing.id)) {
        await this.variantRepo.softDelete(
          existing.id,
          tx,
        );
      }
    }
  }

  // ============================================================
  // PROCESS IMPORTED VARIANTS
  // ============================================================

  for (
    let index = 0;
    index < activePayload.length;
    index++
  ) {
    const input = activePayload[index];

    // ==========================================================
    // VALIDATE SKU
    // ==========================================================

    const inputSku = input?.sku
      ? String(input.sku).trim()
      : '';

    if (!inputSku) {
      throw new ConflictException(
        `SKU is required for variant "${input?.name ?? index + 1}"`,
      );
    }

    const normalizedSku = inputSku.toUpperCase();

    // ==========================================================
    // PRICE VALIDATION
    // ==========================================================

    const pricing = ProductPricingValidator.validate({
      purchasePrice: input.purchasePrice,
      sellingPrice: input.sellingPrice,
      mrp: input.mrp,
    });

    // ==========================================================
    // 🔥 FIND EXISTING VARIANT
    //
    // Priority:
    //
    // 1. Existing ID
    // 2. Existing SKU
    //
    // This is the important part.
    // ==========================================================

    let existing: Variant | undefined;

    // ----------------------------------------------------------
    // First: ID match
    // ----------------------------------------------------------

    if (input.id) {
      existing = existingById.get(input.id);
    }

    // ----------------------------------------------------------
    // Second: SKU match
    // ----------------------------------------------------------

    if (!existing) {
      existing = existingBySku.get(normalizedSku);
    }

    // ==========================================================
    // 🔥 EXISTING VARIANT → UPDATE
    // ==========================================================

    if (existing) {
      // --------------------------------------------------------
      // Safety: make sure the variant belongs to this product
      // --------------------------------------------------------

      if (existing.productId !== product.id) {
        throw new ConflictException(
          `Variant SKU ${inputSku} belongs to another product`,
        );
      }

      // --------------------------------------------------------
      // Restore deleted variant if import finds it
      // --------------------------------------------------------

      if (existing.isDeleted()) {
        existing.restore();
      }

      // --------------------------------------------------------
      // Update content
      // --------------------------------------------------------

      existing.updateDetails({
        name: input.name,

        purchasePrice: pricing.purchasePrice,

        sellingPrice: pricing.sellingPrice,

        mrp: pricing.mrp,

        quantity: new QuantityVO(
          input.quantity ?? 0,
        ).getValue(),

        attributes:
          input.attributes !== undefined
            ? input.attributes
            : existing.attributes,

        reviewCount:
          input.reviewCount !== undefined
            ? Number(input.reviewCount)
            : existing.reviewCount,

        averageRating:
          input.averageRating !== undefined
            ? Number(input.averageRating)
            : existing.averageRating,

        isWeighted:
          input.isWeighted !== undefined
            ? Boolean(input.isWeighted)
            : existing.isWeighted,

        warrantyMonths:
          input.warrantyMonths !== undefined
            ? input.warrantyMonths
            : existing.warrantyMonths,

        priorityOrder:
          input.priorityOrder ?? existing.priorityOrder,
      });

      await this.variantRepo.update(
        existing,
        tx,
      );

      // --------------------------------------------------------
      // Image update
      // --------------------------------------------------------

      await this.variantImageService.sync(
        existing.id,
        existing.name,
        input,
        tx,
      );

      continue;
    }

    // ==========================================================
    // 🔥 NEW VARIANT
    //
    // Only reaches here when SKU does NOT exist.
    // ==========================================================

    if (!input.name?.trim()) {
      throw new ConflictException(
        'Variant name is required',
      );
    }

    // ----------------------------------------------------------
    // IMPORTANT:
    // Use Excel SKU.
    //
    // Do NOT generate a different SKU here.
    // ----------------------------------------------------------

    const sku = inputSku;

    // ----------------------------------------------------------
    // Check global SKU ownership
    // ----------------------------------------------------------

    const skuOwner =
      await this.variantRepo.findBySku(
        sku,
        true,
        tx,
      );

    if (
      skuOwner &&
      skuOwner.productId !== product.id
    ) {
      throw new ConflictException(
        `SKU exists in another product: ${sku}`,
      );
    }

    // ----------------------------------------------------------
    // Generate slug
    // ----------------------------------------------------------

    const slug =
      await this.slugService.generateVariantSlug(
        input.name,
      );

    // ----------------------------------------------------------
    // CREATE ONLY WHEN SKU DOES NOT EXIST
    // ----------------------------------------------------------

    const variant = new Variant(
      crypto.randomUUID(),

      product.id,

      sku,

      input.name,

      slug,

      pricing.purchasePrice,

      pricing.sellingPrice,

      pricing.mrp,

      new QuantityVO(
        input.quantity ?? 0,
      ).getValue(),

      input.attributes ?? {},

      input.averageRating ?? 0,

      input.reviewCount ?? 0,

      input.isWeighted ?? false,

      input.warrantyMonths ?? null,

      input.priorityOrder ?? index,
    );

    const created =
      await this.variantRepo.create(
        variant,
        tx,
      );

    await this.variantImageService.sync(
      created.id,
      created.name,
      input,
      tx,
    );
  }
}

  async getActiveVariants(productId: string, tx?: any) {
    return this.variantRepo.findByProduct(productId, false, tx);
  }
}
