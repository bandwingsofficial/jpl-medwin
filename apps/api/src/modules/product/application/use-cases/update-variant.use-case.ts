import { Injectable, Inject, ConflictException, BadRequestException } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';

import { VariantRepository } from '../../domain/repositories/variant.repository';
import { ProductImageRepository } from '../../domain/repositories/product-image.repository';

import { VariantNotFoundException } from '../../domain/exceptions/variant-not-found.exception';

import { SkuVO } from '../../domain/value-objects/sku.vo';
import { PriceVO } from '../../domain/value-objects/price.vo';
import { QuantityVO } from '../../domain/value-objects/quantity.vo';
import { SlugVO } from '../../../category/domain/value-objects/slug.vo';
import { ImageUrlVO } from '../../domain/value-objects/image-url.vo';

import { ProductImage } from '../../domain/entities/product-image.entity';

import { ImageOwnerType } from '../../domain/enums/image-owner-type.enum';
import { ImageType } from '../../domain/enums/image-type.enum';

@Injectable()
export class UpdateVariantUseCase {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(TOKENS.VARIANT_REPO)
    private readonly variantRepo: VariantRepository,

    @Inject(TOKENS.PRODUCT_IMAGE_REPO)
    private readonly imageRepo: ProductImageRepository,
  ) {}

  async execute(input: any) {
    return this.prisma.$transaction(async (tx) => {
      const variant = await this.variantRepo.findById(input.id, true, tx);

      if (!variant) {
        throw new VariantNotFoundException({ variantId: input.id });
      }

      // =======================
      // ♻️ RESTORE
      // =======================

      if (variant.isDeleted()) {
        variant.restore();
      }

      // =======================
      // 🔥 SLUG LOGIC
      // =======================

      let newSlug: string | undefined;

      if (input.slug) {
        const customSlug = new SlugVO(input.slug).getValue();

        if (customSlug !== variant.slug) {
          const existing = await this.variantRepo.findBySlug(customSlug, true, tx);

          if (existing && existing.id !== variant.id) {
            throw new ConflictException('Slug already exists');
          }
        }

        newSlug = customSlug;
      } else if (input.name && input.name !== variant.name) {
        const baseSlug = new SlugVO(input.name).getValue();

        newSlug = await this.generateUniqueSlug(baseSlug, variant.id, tx);
      }

      // =======================
      // 🔥 SKU CHECK
      // =======================

      if (input.sku && input.sku !== variant.sku) {
        const existingSku = await this.variantRepo.findBySku(input.sku, false, tx);

        if (existingSku && existingSku.id !== variant.id) {
          throw new ConflictException(`SKU exists: ${input.sku}`);
        }

        variant.sku = new SkuVO(input.sku).getValue();
      }

      // =======================
      // 🔥 PRICE VALIDATION
      // =======================

      if (
        input.sellingPrice !== undefined &&
        input.mrp !== undefined &&
        input.sellingPrice > input.mrp
      ) {
        throw new BadRequestException('Selling price cannot exceed MRP');
      }

      // =======================
      // 🔄 APPLY UPDATE
      // =======================

      variant.updateDetails({
        name: input.name,
        slug: newSlug,

        purchasePrice:
          input.purchasePrice !== undefined
            ? new PriceVO(input.purchasePrice).getValue()
            : undefined,

        sellingPrice:
          input.sellingPrice !== undefined ? new PriceVO(input.sellingPrice).getValue() : undefined,

        mrp: input.mrp !== undefined ? new PriceVO(input.mrp).getValue() : undefined,

        quantity:
          input.quantity !== undefined ? new QuantityVO(input.quantity).getValue() : undefined,

        attributes: input.attributes !== undefined ? input.attributes : undefined,

        averageRating: input.averageRating !== undefined ? Number(input.averageRating) : undefined,

        reviewCount: input.reviewCount !== undefined ? Number(input.reviewCount) : undefined,

        isWeighted: input.isWeighted !== undefined ? Boolean(input.isWeighted) : undefined,

        warrantyMonths:
          input.warrantyMonths !== undefined ? Number(input.warrantyMonths) : undefined,
      });

      const updated = await this.variantRepo.update(variant, tx);

      // =======================
      // 🖼 IMAGE SYNC
      // =======================

      let mainImageId: string | null = null;

      // =======================
      // 🖼 MAIN IMAGE
      // =======================

      if (input.mainImage !== undefined) {
        const currentMain = await this.imageRepo.findMainByVariant(variant.id, tx);

        // REMOVE MAIN IMAGE
        if (input.mainImage === null) {
          if (currentMain) {
            await this.imageRepo.softDelete(currentMain.id, tx);
          }
        }

        // CREATE / REPLACE MAIN IMAGE
        else if (input.mainImage) {
          if (currentMain) {
            currentMain.url = new ImageUrlVO(input.mainImage).getValue();

            currentMain.updateDetails({
              alt: variant.name,
            });

            await this.imageRepo.update(currentMain, tx);

            mainImageId = currentMain.id;
          } else {
            const img = await this.imageRepo.create(
              new ProductImage(
                crypto.randomUUID(),
                new ImageUrlVO(input.mainImage).getValue(),
                ImageType.MAIN,
                ImageOwnerType.VARIANT,
                undefined,
                variant.id,
                variant.name,
              ),
              tx,
            );

            mainImageId = img.id;
          }
        }
      }

      // GALLERY IMAGES
      // =======================
      // 🖼 GALLERY IMAGES
      // =======================

      if (Array.isArray(input.images)) {
        for (let i = 0; i < input.images.length; i++) {
          const img = input.images[i];

          // =======================
          // DELETE
          // =======================

          if (img.isDeleted === true && img.id) {
            await this.imageRepo.softDelete(img.id, tx);

            continue;
          }

          // =======================
          // CREATE
          // =======================

          if (!img.id && img.url) {
            await this.imageRepo.create(
              new ProductImage(
                crypto.randomUUID(),
                new ImageUrlVO(img.url).getValue(),
                ImageType.GALLERY,
                ImageOwnerType.VARIANT,
                undefined,
                variant.id,
                img.alt || variant.name,
                i,
              ),
              tx,
            );

            continue;
          }

          // =======================
          // UPDATE
          // =======================

          if (img.id) {
            const existing = await this.imageRepo.findById(img.id, true, tx);

            if (!existing) continue;

            existing.updateDetails({
              alt: img.alt || variant.name,
              sortOrder: i,
            });

            // replace url only if present
            if (img.url) {
              existing.url = new ImageUrlVO(img.url).getValue();
            }

            await this.imageRepo.update(existing, tx);
          }
        }
      }

      // SET MAIN IMAGE
      if (mainImageId) {
        await this.imageRepo.setMainImageForVariant(variant.id, mainImageId, tx);
      }

      return updated;
    });
  }

  // =======================
  // 🔧 HELPER
  // =======================

  private async generateUniqueSlug(base: string, currentId: string, tx: any): Promise<string> {
    let slug = base;
    let counter = 1;

    while (true) {
      const existing = await this.variantRepo.findBySlug(slug, true, tx);

      if (!existing || existing.id === currentId) {
        return slug;
      }

      slug = `${base}-${counter++}`;
    }
  }
}
