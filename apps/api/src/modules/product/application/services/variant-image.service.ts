// src/modules/product/application/services/variant-image.service.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ProductImageRepository } from '../../domain/repositories/product-image.repository';

import { ProductImage } from '../../domain/entities/product-image.entity';

import { ImageOwnerType } from '../../domain/enums/image-owner-type.enum';
import { ImageType } from '../../domain/enums/image-type.enum';

import { ImageUrlVO } from '../../domain/value-objects/image-url.vo';

@Injectable()
export class VariantImageService {
  constructor(
    @Inject(TOKENS.PRODUCT_IMAGE_REPO)
    private readonly imageRepo: ProductImageRepository,
  ) {}

  async sync(variantId: string, name: string, v: any, tx?: any) {
    // =======================
    // 🔥 MAIN IMAGE
    // =======================

    if (v.mainImage !== undefined) {
      const currentMain = await this.imageRepo.findMainByVariant(variantId, tx);

      // REMOVE MAIN
      if (v.mainImage === null) {
        if (currentMain) {
          console.log('🗑 REMOVE MAIN IMAGE:', currentMain.id);

          await this.imageRepo.softDelete(currentMain.id, tx);
        }
      }

      // CREATE / UPDATE MAIN
      else if (typeof v.mainImage === 'string' && v.mainImage.trim()) {
        const url = new ImageUrlVO(v.mainImage).getValue();

        if (currentMain) {
          if (currentMain.url !== url || currentMain.alt !== name) {
            console.log('🔄 UPDATE MAIN IMAGE:', currentMain.id);

            currentMain.url = url;

            currentMain.updateDetails({
              alt: name,
            });

            await this.imageRepo.update(currentMain, tx);
          } else {
            console.log('⏭ MAIN IMAGE UNCHANGED:', currentMain.id);
          }
        } else {
          console.log('➕ CREATE MAIN IMAGE');

          await this.imageRepo.create(
            new ProductImage(
              crypto.randomUUID(),

              url,

              ImageType.MAIN,

              ImageOwnerType.VARIANT,

              undefined,

              variantId,

              name,
            ),

            tx,
          );
        }
      }
    }

    // =======================
    // 🔥 GALLERY
    // =======================

    if (!Array.isArray(v.images)) {
      return;
    }

    let allImages = await this.imageRepo.findByVariant(variantId, false, tx);

    let existingGallery = allImages.filter((img) => img.type === ImageType.GALLERY);

    // =======================
    // REMOVE DUPLICATES
    // =======================

    const seen = new Set<string>();

    for (const image of existingGallery) {
      if (seen.has(image.url)) {
        console.log('🗑 REMOVE DUPLICATE IMAGE:', image.id);

        await this.imageRepo.softDelete(image.id, tx);
      } else {
        seen.add(image.url);
      }
    }

    // reload after cleanup
    allImages = await this.imageRepo.findByVariant(variantId, false, tx);

    existingGallery = allImages.filter((img) => img.type === ImageType.GALLERY);

    const existingMap = new Map(existingGallery.map((img) => [img.url, img]));

    const importedUrls = new Set<string>();

    for (let i = 0; i < v.images.length; i++) {
      const img = v.images[i];

      if (!img || typeof img.url !== 'string' || !img.url.trim()) {
        continue;
      }

      const url = new ImageUrlVO(img.url).getValue();

      importedUrls.add(url);

      const existing = existingMap.get(url);

      // =======================
      // UPDATE EXISTING
      // =======================

      if (existing) {
        const alt = img.alt || name;

        if (existing.alt !== alt || existing.sortOrder !== i) {
          console.log('🔄 UPDATE IMAGE:', existing.id);

          existing.updateDetails({
            alt,
            sortOrder: i,
          });

          await this.imageRepo.update(existing, tx);
        } else {
          console.log('⏭ IMAGE UNCHANGED:', existing.id);
        }

        continue;
      }

      // =======================
      // CREATE NEW
      // =======================

      console.log('➕ CREATE IMAGE:', url);

      await this.imageRepo.create(
        new ProductImage(
          crypto.randomUUID(),

          url,

          ImageType.GALLERY,

          ImageOwnerType.VARIANT,

          undefined,

          variantId,

          img.alt || name,

          i,
        ),

        tx,
      );
    }

    // =======================
    // REMOVE DELETED IMAGES
    // =======================

    for (const image of existingGallery) {
      if (!importedUrls.has(image.url)) {
        console.log('🗑 REMOVE IMAGE:', image.id);

        await this.imageRepo.softDelete(image.id, tx);
      }
    }

    // =======================
    // DEBUG
    // =======================

    const finalImages = await this.imageRepo.findByVariant(variantId, false, tx);

    console.log('🔥 FINAL VARIANT IMAGES:', JSON.stringify(finalImages, null, 2));
  }
}
