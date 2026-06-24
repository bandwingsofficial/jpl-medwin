import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { VariantRepository } from '../../domain/repositories/variant.repository';
import { ProductImageRepository } from '../../domain/repositories/product-image.repository';

import { ProductDomainService } from '../../domain/services/product-domain.service';

import { Product } from '../../domain/entities/product.entity';
import { Variant } from '../../domain/entities/variant.entity';
import { ProductImage } from '../../domain/entities/product-image.entity';

import { SkuVO } from '../../domain/value-objects/sku.vo';
import { PriceVO } from '../../domain/value-objects/price.vo';
import { QuantityVO } from '../../domain/value-objects/quantity.vo';
import { ImageUrlVO } from '../../domain/value-objects/image-url.vo';

import { ImageOwnerType } from '../../domain/enums/image-owner-type.enum';
import { ImageType } from '../../domain/enums/image-type.enum';

import { ProductSlugService } from './product-slug.service';

@Injectable()
export class VariantCreatorService {
  constructor(
    @Inject(TOKENS.VARIANT_REPO)
    private readonly variantRepo: VariantRepository,

    @Inject(TOKENS.PRODUCT_IMAGE_REPO)
    private readonly imageRepo: ProductImageRepository,

    private readonly domainService: ProductDomainService,

    private readonly slugService: ProductSlugService,
  ) {}

  async createVariants(
    product: Product,

    variants: any[] = [],

    tx?: any,
  ): Promise<string | undefined> {
    let defaultVariantId: string | undefined;

    for (const v of variants) {
      // =======================
      // ♻️ RESTORE DELETED VARIANT
      // =======================

      const existingDeletedVariant = await this.variantRepo.findBySku(
        v.sku,
        true,
        tx,
      );

      if (existingDeletedVariant && existingDeletedVariant.isDeleted()) {
        existingDeletedVariant.restore();

        existingDeletedVariant.updateDetails({
          name: v.name,

          purchasePrice: v.purchasePrice,

          sellingPrice: v.sellingPrice,

          mrp: v.mrp,

          quantity: v.quantity,

          attributes: v.attributes ?? {},

          averageRating: v.averageRating,

          reviewCount: v.reviewCount,

          isWeighted: v.isWeighted,

          warrantyMonths: v.warrantyMonths,
        });

        const restoredVariant = await this.variantRepo.update(
          existingDeletedVariant,
          tx,
        );

        if (!defaultVariantId) {
          defaultVariantId = restoredVariant.id;
        }

        continue;
      }

      // =======================
      // 🔒 VALIDATE SKU
      // =======================

      await this.domainService.validateVariantSku(v.sku);

      if (!v.name) {
        throw new Error('Variant name is required');
      }

      // =======================
      // 🔥 SLUG
      // =======================

      const slug = await this.slugService.generateVariantSlug(v.name);

      // =======================
      // 🆕 CREATE VARIANT
      // =======================

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

      variant.updateDetails({
        attributes: v.attributes ?? {},

        averageRating: v.averageRating,

        reviewCount: v.reviewCount,

        isWeighted: v.isWeighted,

        warrantyMonths: v.warrantyMonths,
      });

      const createdVariant = await this.variantRepo.create(
        variant,
        tx,
      );

      if (!defaultVariantId) {
        defaultVariantId = createdVariant.id;
      }

      // =======================
      // 🖼 MAIN IMAGE
      // =======================

      let mainImageId: string | null = null;

      if (v.mainImage) {
        const image = await this.imageRepo.create(
          new ProductImage(
            crypto.randomUUID(),

            new ImageUrlVO(v.mainImage).getValue(),

            ImageType.MAIN,

            ImageOwnerType.VARIANT,

            undefined,

            createdVariant.id,

            v.name,

            0,
          ),

          tx,
        );

        mainImageId = image.id;
      }

      // =======================
      // 🖼 GALLERY IMAGES
      // =======================

      for (const img of v.images ?? []) {
        await this.imageRepo.create(
          new ProductImage(
            crypto.randomUUID(),

            new ImageUrlVO(img.url).getValue(),

            ImageType.GALLERY,

            ImageOwnerType.VARIANT,

            undefined,

            createdVariant.id,

            img.alt,

            img.sortOrder ?? 0,
          ),

          tx,
        );
      }

      // =======================
      // ⭐ SET MAIN IMAGE
      // =======================

      if (mainImageId) {
        await this.imageRepo.setMainImageForVariant(
          createdVariant.id,
          mainImageId,
          tx,
        );
      }
    }

    return defaultVariantId;
  }
}

