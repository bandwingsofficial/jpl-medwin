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
    const productSlug = this.slugService.getBaseSlug(productName);

    console.log('[S3] Resolving product images for:', productName);
    console.log('[S3] Product slug:', productSlug);

   const prefix = `${PRODUCT_IMAGE_FOLDER}/products/${productSlug}`;

    const mainImage = await this.resolveMainImageAtPrefix(prefix);

    const galleryImages = await this.resolveGalleryAtPrefix(prefix);

    const bundle: ProductImageBundle = {
      mainImage,
      galleryImages,
    };

    console.log('[S3] Final product bundle:', bundle);

    return bundle;
  }

  // =======================
  // 🖼 VARIANT IMAGES
  // =======================

  async resolveVariantImages(
    productName: string,
    variantName: string,
    productBundle: ProductImageBundle = EMPTY_PRODUCT_BUNDLE,
  ): Promise<VariantImageBundle> {
    const productSlug = this.slugService.getBaseSlug(productName);
    const variantSlug = this.slugService.getBaseSlug(variantName);

    console.log('[S3] Resolving variant images for:', variantName);
    console.log('[S3] Product slug:', productSlug);
    console.log('[S3] Variant slug:', variantSlug);

    const prefix = `${PRODUCT_IMAGE_FOLDER}/products/${productSlug}/variants/${variantSlug}`;

    const variantMainImage = await this.resolveMainImageAtPrefix(prefix);

    const variantGalleryImages = await this.resolveGalleryAtPrefix(prefix);

    const bundle: VariantImageBundle = {
      mainImage: variantMainImage ?? productBundle.mainImage,
      galleryImages:
        variantGalleryImages.length > 0 ? variantGalleryImages : [...productBundle.galleryImages],
    };

    if (!variantMainImage && productBundle.mainImage) {
      console.log(
        '[S3] Variant main not found, fallback to product main:',
        productBundle.mainImage,
      );
    }

    if (variantGalleryImages.length === 0 && productBundle.galleryImages.length > 0) {
      console.log(
        '[S3] Variant gallery empty, fallback to product gallery:',
        productBundle.galleryImages,
      );
    }

    console.log('[S3] Final variant bundle:', bundle);

    return bundle;
  }

  /** @deprecated Use resolveProductImages().mainImage */
  async resolveMainImageUrl(nameOrSlug: string): Promise<string | null> {
    const bundle = await this.resolveProductImages(nameOrSlug);
    return bundle.mainImage;
  }

  // =======================
  // 🔐 INTERNAL
  // =======================

  private async resolveMainImageAtPrefix(prefix: string): Promise<string | null> {
    for (const extension of IMAGE_EXTENSIONS) {
      const key = `${prefix}/main.${extension}`;

      console.log('[S3] Main image key checked:', key);

      if (await this.s3Service.objectExists(key)) {
        const url = this.s3Service.getPublicUrl(key);

        console.log('[S3] FOUND image:', key);
        console.log('[S3] Public URL:', url);

        return url;
      }

      console.log('[S3] NOT FOUND image:', key);
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

  private async resolveGalleryImageAtPrefix(prefix: string, index: number): Promise<string | null> {
    for (const extension of IMAGE_EXTENSIONS) {
      const key = `${prefix}/image${index}.${extension}`;

      console.log('[S3] Gallery key checked:', key);

      if (await this.s3Service.objectExists(key)) {
        const url = this.s3Service.getPublicUrl(key);

        console.log('[S3] FOUND image:', key);
        console.log('[S3] Public URL:', url);

        return url;
      }

      console.log('[S3] NOT FOUND image:', key);
    }

    return null;
  }
}
