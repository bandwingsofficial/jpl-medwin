// src/modules/product/application/services/variant-sync.service.ts

import {
  Inject,
  Injectable,
  ConflictException,
} from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { Product } from '../../domain/entities/product.entity';
import { Variant } from '../../domain/entities/variant.entity';

import { VariantRepository } from '../../domain/repositories/variant.repository';

import { SkuVO } from '../../domain/value-objects/sku.vo';
import { PriceVO } from '../../domain/value-objects/price.vo';
import { QuantityVO } from '../../domain/value-objects/quantity.vo';

import { ProductSlugService } from './product-slug.service';
import { VariantImageService } from './variant-image.service';

@Injectable()
export class VariantSyncService {
  constructor(
    @Inject(TOKENS.VARIANT_REPO)
    private readonly variantRepo: VariantRepository,

    private readonly slugService: ProductSlugService,

    private readonly variantImageService: VariantImageService,
  ) {}

  async sync(
    product: Product,
    variants: any[] = [],
    tx?: any,
  ) {
    const existingVariants =
      await this.variantRepo.findByProduct(
        product.id,
        false,
        tx,
      );

    // Match existing variants by SKU instead of ID
    const existingMap = new Map(
      existingVariants.map((v) => [v.sku, v]),
    );

    for (const v of variants) {
      // =======================
      // DELETE
      // =======================

      if (v.id && v.isDeleted) {
        await this.variantRepo.softDelete(
          v.id,
          tx,
        );

        continue;
      }

      // =======================
      // FIND EXISTING BY SKU
      // =======================

      const existing =
        existingMap.get(v.sku);

      // =======================
      // UPDATE
      // =======================

      if (existing) {
        if (existing.isDeleted()) {
          existing.restore();
        }

        existing.updateDetails({
          name: v.name,

          slug: existing.slug,

          purchasePrice: v.purchasePrice,

          sellingPrice: v.sellingPrice,

          mrp: v.mrp,

          quantity: v.quantity,

          attributes: v.attributes,

          reviewCount: v.reviewCount,

          averageRating: v.averageRating,

          isWeighted: v.isWeighted,

          warrantyMonths: v.warrantyMonths,
        });

        await this.variantRepo.update(
          existing,
          tx,
        );

        await this.variantImageService.sync(
          existing.id,
          existing.name,
          v,
          tx,
        );

        continue;
      }

      // =======================
      // CHECK SKU CONFLICT
      // =======================

      const skuOwner =
        await this.variantRepo.findBySku(
          v.sku,
          false,
          tx,
        );

      if (
        skuOwner &&
        skuOwner.productId !== product.id
      ) {
        throw new ConflictException(
          `SKU exists: ${v.sku}`,
        );
      }

      // =======================
      // CREATE
      // =======================

      const slug =
        await this.slugService.generateVariantSlug(
          v.name,
        );

      const variant = new Variant(
        crypto.randomUUID(),

        product.id,

        new SkuVO(v.sku).getValue(),

        v.name,

        slug,

        new PriceVO(v.purchasePrice).getValue(),

        new PriceVO(v.sellingPrice).getValue(),

        new PriceVO(v.mrp).getValue(),

        new QuantityVO(v.quantity).getValue(),
      );

      const created =
        await this.variantRepo.create(
          variant,
          tx,
        );

      await this.variantImageService.sync(
        created.id,
        created.name,
        v,
        tx,
      );
    }
  }

  async getActiveVariants(
    productId: string,
    tx?: any,
  ) {
    return this.variantRepo.findByProduct(
      productId,
      false,
      tx,
    );
  }
}