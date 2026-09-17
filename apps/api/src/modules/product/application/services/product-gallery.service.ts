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
    const cleanUrl = (u?: string | null) => (u ? u.trim().split('?')[0] : '');

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
        const rawUrl = new ImageUrlVO(input.mainImage).getValue();
        const url = cleanUrl(rawUrl);

        if (currentMain) {
          const currentCleanUrl = cleanUrl(currentMain.url);
          if (currentCleanUrl !== url) {
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

    // Deduplicate in-memory by ID first, then clean URL
    const seenIds = new Set<string>();
    const seenUrls = new Set<string>();
    const uniqueGallery: ProductImage[] = [];

    for (const image of existingGallery) {
      const cUrl = cleanUrl(image.url);
      if (seenIds.has(image.id) || (cUrl && seenUrls.has(cUrl))) {
        await this.imageRepo.softDelete(image.id, tx);
      } else {
        seenIds.add(image.id);
        if (cUrl) seenUrls.add(cUrl);
        uniqueGallery.push(image);
      }
    }

    const existingById = new Map(uniqueGallery.map((img) => [img.id, img]));
    const existingByUrl = new Map(uniqueGallery.map((img) => [cleanUrl(img.url), img]));
    const retainedImageIds = new Set<string>();

    for (let i = 0; i < input.images.length; i++) {
      const img = input.images[i];
      if (!img || img.isDeleted === true || img.isDeleted === 'true') {
        continue;
      }

      if (typeof img.url !== 'string' || !img.url.trim()) {
        continue;
      }

      const rawUrl = new ImageUrlVO(img.url).getValue();
      const url = cleanUrl(rawUrl);
      const existing = (img.id ? existingById.get(img.id) : undefined) || (url ? existingByUrl.get(url) : undefined);

      if (existing) {
        retainedImageIds.add(existing.id);
        const alt = img.alt;
        const targetSortOrder = typeof img.sortOrder === 'number' ? img.sortOrder : i;

        if (existing.alt !== alt || existing.sortOrder !== targetSortOrder || cleanUrl(existing.url) !== url) {
          if (cleanUrl(existing.url) !== url) {
            existing.url = url;
          }
          existing.updateDetails({
            alt,
            sortOrder: targetSortOrder,
          });
          await this.imageRepo.update(existing, tx);
        }
      } else {
        const newImageId = img.id || crypto.randomUUID();
        const created = await this.imageRepo.create(
          new ProductImage(
            newImageId,
            url,
            ImageType.GALLERY,
            ImageOwnerType.PRODUCT,
            product.id,
            undefined,
            img.alt,
            typeof img.sortOrder === 'number' ? img.sortOrder : i,
          ),
          tx,
        );
        retainedImageIds.add(created.id);
      }
    }

    // Delete removed images
    for (const image of uniqueGallery) {
      if (!retainedImageIds.has(image.id)) {
        await this.imageRepo.softDelete(image.id, tx);
      }
    }
  }
}
