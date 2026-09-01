// src/modules/product/application/services/product-gallery.service.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ProductImageRepository } from '../../domain/repositories/product-image.repository';

import { Product } from '../../domain/entities/product.entity';
import { ProductImage } from '../../domain/entities/product-image.entity';

import { ImageOwnerType } from '../../domain/enums/image-owner-type.enum';
import { ImageType } from '../../domain/enums/image-type.enum';

import { ImageUrlVO } from '../../domain/value-objects/image-url.vo';

@Injectable()
export class ProductGalleryService {
  constructor(
    @Inject(TOKENS.PRODUCT_IMAGE_REPO)
    private readonly imageRepo: ProductImageRepository,
  ) {}

  async sync(
    product: Product,
    input: any,
    tx?: any,
  ) {
    // ============================================================
    // 🔍 1. FETCH ALL EXISTING PRODUCT IMAGES IN ONE QUERY
    // ============================================================
    const allImages = await this.imageRepo.findByProduct(product.id, false, tx);

    let currentMain = allImages.find((img) => img.type === ImageType.MAIN);
    let existingGallery = allImages.filter((img) => img.type === ImageType.GALLERY);

    // ============================================================
    // 🖼 2. PRODUCT MAIN IMAGE SYNCHRONIZATION
    // ============================================================
    if (input.mainImage !== undefined) {
      // REMOVE MAIN
      if (input.mainImage === null) {
        if (currentMain) {
          await this.imageRepo.softDelete(currentMain.id, tx);
          currentMain = undefined;
        }
      }
      // CREATE / REPLACE MAIN
      else if (typeof input.mainImage === 'string' && input.mainImage.trim()) {
        const url = new ImageUrlVO(input.mainImage).getValue();

        if (currentMain) {
          if (currentMain.url !== url) {
            currentMain.url = url;
            await this.imageRepo.update(currentMain, tx);
          }
        } else {
          const img = await this.imageRepo.create(
            new ProductImage(
              crypto.randomUUID(),
              url,
              ImageType.MAIN,
              ImageOwnerType.PRODUCT,
              product.id,
            ),
            tx,
          );
          currentMain = img;
          await this.imageRepo.setMainImageForProduct(product.id, img.id, tx);
        }
      }
    }

    // ============================================================
    // 🖼 3. PRODUCT GALLERY SYNCHRONIZATION
    // ============================================================
    if (!Array.isArray(input.images)) {
      return;
    }

    // Deduplicate in-memory
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

    for (let i = 0; i < input.images.length; i++) {
      const img = input.images[i];
      if (!img || typeof img.url !== 'string' || !img.url.trim()) {
        continue;
      }

      const url = new ImageUrlVO(img.url).getValue();
      importedUrls.add(url);

      const existing = existingMap.get(url);

      if (existing) {
        const alt = img.alt;
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
            ImageOwnerType.PRODUCT,
            product.id,
            undefined,
            img.alt,
            i,
          ),
          tx,
        );
      }
    }

    // Delete removed images
    for (const image of uniqueGallery) {
      if (!importedUrls.has(image.url)) {
        await this.imageRepo.softDelete(image.id, tx);
      }
    }
  }
}
