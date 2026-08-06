import { Injectable } from '@nestjs/common';

import { S3Service } from '@/modules/upload/infrastructure/s3.service';

import { ProductSlugService } from './product-slug.service';

import { ProductImageBundle, VariantImageBundle } from '../types/product-s3-image.types';

const PRODUCT_IMAGE_FOLDER = 'products';

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'] as const;

const EMPTY_PRODUCT_BUNDLE: ProductImageBundle = {
  mainImage: null,
  galleryImages: [],
};

@Injectable()
export class ProductS3ImageResolverService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly slugService: ProductSlugService,
  ) {}

  // =======================
  // 🖼 PRODUCT IMAGES
  // =======================

  async resolveProductImages(productName: string): Promise<ProductImageBundle> {

  console.log("=================================");
  console.log("Product Name :", productName);
  console.log("JSON         :", JSON.stringify(productName));
  console.log("Length       :", productName.length);
  console.log(
    "ASCII        :",
    [...productName].map(c => `${c}:${c.charCodeAt(0)}`)
  );
  console.log("=================================");

  const prefix = `${PRODUCT_IMAGE_FOLDER}/${productName}`;

  console.log("Prefix :", prefix);

  const mainImage = await this.resolveMainImageAtPrefix(prefix);
  const galleryImages = await this.resolveGalleryAtPrefix(prefix);

  return {
    mainImage,
    galleryImages,
  };
}

  // =======================
  // 🖼 VARIANT IMAGES
  // =======================

 async resolveVariantImages(
  productName: string,
  variantName: string,
  productBundle: ProductImageBundle = EMPTY_PRODUCT_BUNDLE,
): Promise<VariantImageBundle> {

 const prefix =
  `${PRODUCT_IMAGE_FOLDER}/${productName}/Variant/${variantName}`;
  console.log("==================");
console.log("Product:", productName);
console.log("Variant:", variantName);
console.log("Prefix:", prefix);
console.log("==================");

  const variantMainImage =
  await this.resolveVariantImage(prefix);

 return {
  mainImage:
    variantMainImage ?? productBundle.mainImage,

  // Keep product gallery because variant has no gallery
  galleryImages: productBundle.galleryImages,
};
}
  /** @deprecated Use resolveProductImages().mainImage */
  async resolveMainImageUrl(nameOrSlug: string): Promise<string | null> {
    const bundle = await this.resolveProductImages(nameOrSlug);
    return bundle.mainImage;
  }

  // =======================
  // 🔐 INTERNAL
  // =======================

  private async resolveMainImageAtPrefix(
  prefix: string,
): Promise<string | null> {
  const fileNames = ['main', 'Main'];

  for (const fileName of fileNames) {
    for (const extension of IMAGE_EXTENSIONS) {
      const key = `${prefix}/${fileName}.${extension}`;

      console.log('Checking:', key);

      const exists = await this.s3Service.objectExists(key);

      console.log('Exists:', exists);

      if (exists) {
        const url = this.s3Service.getPublicUrl(key);

        console.log('[S3] FOUND image:', key);
        console.log('[S3] URL:', url);

        return url;
      }

      console.log('[S3] NOT FOUND image:', key);
    }
  }

  return null;
}

  private async resolveVariantImage(
  prefix: string,
): Promise<string | null> {

  for (const extension of IMAGE_EXTENSIONS) {

    const key = `${prefix}.${extension}`;
    console.log("Checking:", key);

    const exists =
      await this.s3Service.objectExists(key);
    console.log("Exists:", exists);
    console.log({
      key,
      exists,
    });

    if (exists) {
      return this.s3Service.getPublicUrl(key);
    }
  }

  return null;
}

  private async resolveGalleryAtPrefix(prefix: string): Promise<string[]> {
    const galleryImages: string[] = [];

    let index = 1;

    while (true) {
      const url = await this.resolveGalleryImageAtPrefix(prefix, index);

      if (!url) {
        break;
      }

      galleryImages.push(url);
      index++;
    }

    return galleryImages;
  }

 private async resolveGalleryImageAtPrefix(
  prefix: string,
  index: number,
): Promise<string | null> {
  const fileNames = [
    `image${index}`,
    `image ${index}`,
  ];

  for (const fileName of fileNames) {
    for (const extension of IMAGE_EXTENSIONS) {
      const key = `${prefix}/${fileName}.${extension}`;

      console.log("[S3] Gallery key checked:", key);

      if (await this.s3Service.objectExists(key)) {
        const url = this.s3Service.getPublicUrl(key);

        console.log("[S3] FOUND image:", key);
        console.log("[S3] Public URL:", url);

        return url;
      }
    }
  }

  return null;
}}
