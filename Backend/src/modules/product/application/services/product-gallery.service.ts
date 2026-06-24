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
    // =======================
    // 🖼 PRODUCT MAIN IMAGE
    // =======================

    if (input.mainImage !== undefined) {
      const currentMain = await this.imageRepo.findMainByProduct(
        product.id,
        tx,
      );

      // REMOVE MAIN
      if (input.mainImage === null) {
        if (currentMain) {
          console.log('🗑 REMOVE PRODUCT MAIN:', currentMain.id);

          await this.imageRepo.softDelete(
            currentMain.id,
            tx,
          );
        }
      }

      // CREATE / REPLACE MAIN
      else if (
        typeof input.mainImage === 'string' &&
        input.mainImage.trim()
      ) {
        if (currentMain) {
  const url = new ImageUrlVO(
    input.mainImage,
  ).getValue();

  if (currentMain.url !== url) {
    console.log(
      '🔄 UPDATE PRODUCT MAIN:',
      currentMain.id,
    );

    currentMain.url = url;

    await this.imageRepo.update(
      currentMain,
      tx,
    );
  } else {
    console.log(
      '⏭ PRODUCT MAIN UNCHANGED:',
      currentMain.id,
    );
  }
} else {
          console.log('➕ CREATE PRODUCT MAIN');

          const img = await this.imageRepo.create(
            new ProductImage(
              crypto.randomUUID(),

              new ImageUrlVO(
                input.mainImage,
              ).getValue(),

              ImageType.MAIN,

              ImageOwnerType.PRODUCT,

              product.id,
            ),

            tx,
          );

          await this.imageRepo.setMainImageForProduct(
            product.id,
            img.id,
            tx,
          );
        }
      }
    }

// =======================
// 🖼 PRODUCT GALLERY
// =======================

if (!Array.isArray(input.images)) {
  return;
}

let allImages = await this.imageRepo.findByProduct(
  product.id,
  false,
  tx,
);

let existingGallery = allImages.filter(
  (img) => img.type === ImageType.GALLERY,
);

// =======================
// REMOVE DUPLICATES
// =======================

const seen = new Set<string>();

for (const image of existingGallery) {
  if (seen.has(image.url)) {
    console.log(
      '🗑 REMOVE DUPLICATE PRODUCT IMAGE:',
      image.id,
    );

    await this.imageRepo.softDelete(
      image.id,
      tx,
    );
  } else {
    seen.add(image.url);
  }
}

// Reload after cleanup
allImages = await this.imageRepo.findByProduct(
  product.id,
  false,
  tx,
);

existingGallery = allImages.filter(
  (img) => img.type === ImageType.GALLERY,
);

const existingMap = new Map(
  existingGallery.map((img) => [
    img.url,
    img,
  ]),
);

const importedUrls = new Set<string>();

for (let i = 0; i < input.images.length; i++) {
  const img = input.images[i];

  if (
    !img ||
    typeof img.url !== 'string' ||
    !img.url.trim()
  ) {
    continue;
  }

  const url = new ImageUrlVO(
    img.url,
  ).getValue();

  importedUrls.add(url);

  const existing = existingMap.get(url);

  // =======================
  // UPDATE EXISTING
  // =======================

if (existing) {
  const alt = img.alt;

  if (
    existing.alt !== alt ||
    existing.sortOrder !== i
  ) {
    console.log(
      '🔄 UPDATE PRODUCT IMAGE:',
      existing.id,
    );

    existing.updateDetails({
      alt,
      sortOrder: i,
    });

    await this.imageRepo.update(
      existing,
      tx,
    );
  } else {
    console.log(
      '⏭ PRODUCT IMAGE UNCHANGED:',
      existing.id,
    );
  }

  continue;
}

  // =======================
  // CREATE NEW
  // =======================

  console.log(
    '➕ CREATE PRODUCT IMAGE:',
    url,
  );

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

// =======================
// DELETE REMOVED IMAGES
// =======================

for (const image of existingGallery) {
  if (!importedUrls.has(image.url)) {
    console.log(
      '🗑 REMOVE PRODUCT IMAGE:',
      image.id,
    );

    await this.imageRepo.softDelete(
      image.id,
      tx,
    );
  }
}
  }
}