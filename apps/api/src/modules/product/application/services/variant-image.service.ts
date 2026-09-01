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
    // ============================================================
    // 🔍 1. FETCH ALL EXISTING IMAGES FOR THIS VARIANT IN ONE QUERY
    // ============================================================
    const allImages = await this.imageRepo.findByVariant(variantId, false, tx);

    let currentMain = allImages.find((img) => img.type === ImageType.MAIN);
    let existingGallery = allImages.filter((img) => img.type === ImageType.GALLERY);

    // ============================================================
    // 🔥 2. MAIN IMAGE SYNCHRONIZATION
    // ============================================================
    if (v.mainImage !== undefined) {
      // REMOVE MAIN
      if (v.mainImage === null) {
        if (currentMain) {
          await this.imageRepo.softDelete(currentMain.id, tx);
          currentMain = undefined;
        }
      }
      // CREATE / UPDATE MAIN
      else if (typeof v.mainImage === 'string' && v.mainImage.trim()) {
        const url = new ImageUrlVO(v.mainImage).getValue();

        if (currentMain) {
          if (currentMain.url !== url || currentMain.alt !== name) {
            currentMain.url = url;
            currentMain.updateDetails({
              alt: name,
            });
            await this.imageRepo.update(currentMain, tx);
          }
        } else {
          const newMain = await this.imageRepo.create(
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
          currentMain = newMain;
        }
      }
    }

    // ============================================================
    // 🖼 3. GALLERY SYNCHRONIZATION
    // ============================================================
    if (!Array.isArray(v.images)) {
      return;
    }

    // Deduplicate existing gallery in memory and delete duplicates
    const seenUrls = new Set<string>();
    const uniqueGallery: ProductImage[] = [];

    for (const image of existingGallery) {
      if (seenUrls.has(image.url)) {
        await this.imageRepo.softDelete(image.id, tx);
      } else {
        seenUrls.add(image.url);
        uniqueGallery.push(image);
      }
    }

    const existingMap = new Map(uniqueGallery.map((img) => [img.url, img]));
    const importedUrls = new Set<string>();

    for (let i = 0; i < v.images.length; i++) {
      const img = v.images[i];
      if (!img || typeof img.url !== 'string' || !img.url.trim()) {
        continue;
      }

      const url = new ImageUrlVO(img.url).getValue();
      importedUrls.add(url);

      const existing = existingMap.get(url);

      if (existing) {
        const alt = img.alt || name;
        if (existing.alt !== alt || existing.sortOrder !== i) {
          existing.updateDetails({
            alt,
            sortOrder: i,
          });
          await this.imageRepo.update(existing, tx);
        }
      } else {
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
    }

    // Remove deleted gallery images
    for (const image of uniqueGallery) {
      if (!importedUrls.has(image.url)) {
        await this.imageRepo.softDelete(image.id, tx);
      }
    }
  }
}
