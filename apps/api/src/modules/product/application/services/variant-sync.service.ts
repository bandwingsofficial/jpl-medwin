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

  async sync(product: Product, variants: any[] = [], tx?: any) {
    const existingVariants = await this.variantRepo.findByProduct(product.id, false, tx);
    const existingAllVariants = await this.variantRepo.findByProduct(product.id, true, tx);

    const existingById = new Map(existingAllVariants.map((variant) => [variant.id, variant]));

    const activePayload = variants.filter((variant) => !variant?.isDeleted);

    const payloadIds = new Set(
      activePayload.filter((variant) => variant?.id).map((variant) => variant.id as string),
    );

    // Soft-delete variants removed from payload
    for (const existing of existingVariants) {
      if (!payloadIds.has(existing.id)) {
        await this.variantRepo.softDelete(existing.id, tx);
      }
    }

    for (let index = 0; index < variants.length; index++) {
      const input = variants[index];

      if (input?.isDeleted && input?.id) {
        await this.variantRepo.softDelete(input.id, tx);
        continue;
      }

      if (input?.isDeleted) {
        continue;
      }

      const pricing = ProductPricingValidator.validate({
        purchasePrice: input.purchasePrice,
        sellingPrice: input.sellingPrice,
        mrp: input.mrp,
      });

      const existing = input.id ? existingById.get(input.id) : undefined;

      if (existing) {
        if (existing.isDeleted()) {
          existing.restore();
        }

        existing.updateDetails({
          name: input.name,

          purchasePrice: pricing.purchasePrice,

          sellingPrice: pricing.sellingPrice,

          mrp: pricing.mrp,

          quantity: new QuantityVO(input.quantity).getValue(),

          attributes: input.attributes,

          reviewCount: input.reviewCount,

          averageRating: input.averageRating,

          isWeighted: input.isWeighted,

          warrantyMonths: input.warrantyMonths,

          priorityOrder: input.priorityOrder ?? index,
        });

        await this.variantRepo.update(existing, tx);

        await this.variantImageService.sync(existing.id, existing.name, input, tx);

        continue;
      }

      if (!input.name?.trim()) {
        throw new ConflictException('Variant name is required');
      }

      const sku = await this.skuService.resolveVariantSku({
        brandId: product.brandId,
        customerType: product.customerType,
        productId: product.id,
        tx,
      });

      const skuOwner = await this.variantRepo.findBySku(sku, false, tx);

      if (skuOwner && skuOwner.productId !== product.id) {
        throw new ConflictException(`SKU exists: ${sku}`);
      }

      const slug = await this.slugService.generateVariantSlug(input.name);

      const variant = new Variant(
        crypto.randomUUID(),

        product.id,

        sku,

        input.name,

        slug,

        pricing.purchasePrice,

        pricing.sellingPrice,

        pricing.mrp,

        new QuantityVO(input.quantity).getValue(),

        input.attributes ?? {},

        input.averageRating ?? 0,

        input.reviewCount ?? 0,

        input.isWeighted ?? false,

        input.warrantyMonths ?? null,

        input.priorityOrder ?? index,
      );

      const created = await this.variantRepo.create(variant, tx);

      await this.variantImageService.sync(created.id, created.name, input, tx);
    }
  }

  async getActiveVariants(productId: string, tx?: any) {
    return this.variantRepo.findByProduct(productId, false, tx);
  }
}
