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
  const prefix = `${PRODUCT_IMAGE_FOLDER}/${productName}`;

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


      const exists = await this.s3Service.objectExists(key);


      if (exists) {
        const url = this.s3Service.getPublicUrl(key);

    

        return url;
      }

    }
  }

  return null;
}

  private async resolveVariantImage(
  prefix: string,
): Promise<string | null> {

  for (const extension of IMAGE_EXTENSIONS) {

    const key = `${prefix}.${extension}`;
   
    const exists =
      await this.s3Service.objectExists(key);


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
  `Image ${index}`,
  `Image${index}`,
  `image ${index}`,
  `image${index}`,
];

  for (const fileName of fileNames) {
    for (const extension of IMAGE_EXTENSIONS) {
      const key = `${prefix}/${fileName}.${extension}`;


      if (await this.s3Service.objectExists(key)) {
        const url = this.s3Service.getPublicUrl(key);


        return url;
      }
    }
  }

  return null;
}}
