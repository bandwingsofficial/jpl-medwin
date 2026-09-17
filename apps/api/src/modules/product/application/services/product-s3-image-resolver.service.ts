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

  async resolveProductImages(
    productName: string,
    productId?: string,
    productSlug?: string,
  ): Promise<ProductImageBundle> {
    const prefixes: string[] = [];
    if (productName?.trim()) prefixes.push(`${PRODUCT_IMAGE_FOLDER}/${productName.trim()}`);
    if (productId?.trim() && productId !== productName) prefixes.push(`${PRODUCT_IMAGE_FOLDER}/${productId.trim()}`);
    if (productSlug?.trim() && productSlug !== productName && productSlug !== productId) prefixes.push(`${PRODUCT_IMAGE_FOLDER}/${productSlug.trim()}`);

    for (const prefix of prefixes) {
      const keys = await this.s3Service.listKeys(prefix);
      if (keys.length > 0) {
        // Find main image key
        const mainKey = keys.find((k) => {
          const lower = k.toLowerCase();
          const fileName = lower.split('/').pop() || '';
          return fileName.startsWith('main.') || fileName === 'main';
        });

        // Filter valid image extensions
        const validImageKeys = keys.filter((k) => {
          const lower = k.toLowerCase();
          return IMAGE_EXTENSIONS.some((ext) => lower.endsWith(`.${ext}`));
        });

        // Gallery keys = all images excluding main image and variant folders
        const galleryKeys = validImageKeys.filter(
          (k) => k !== mainKey && !k.toLowerCase().includes('/variant/'),
        );

        const mainUrl = mainKey
          ? this.s3Service.getPublicUrl(mainKey)
          : validImageKeys.length > 0
            ? this.s3Service.getPublicUrl(validImageKeys[0])
            : null;

        const galleryUrls = galleryKeys.map((k) => this.s3Service.getPublicUrl(k));

        if (mainUrl || galleryUrls.length > 0) {
          return {
            mainImage: mainUrl,
            galleryImages: galleryUrls,
          };
        }
      }

      // Fallback to targeted filename probing
      const mainImage = await this.resolveMainImageAtPrefix(prefix);
      const galleryImages = await this.resolveGalleryAtPrefix(prefix);
      if (mainImage || galleryImages.length > 0) {
        return {
          mainImage,
          galleryImages,
        };
      }
    }

    return {
      mainImage: null,
      galleryImages: [],
    };
  }

  // =======================
  // 🖼 VARIANT IMAGES
  // =======================

  async resolveVariantImages(
    productName: string,
    variantName: string,
    productBundle: ProductImageBundle = EMPTY_PRODUCT_BUNDLE,
    productId?: string,
  ): Promise<VariantImageBundle> {
    const prefixes: string[] = [];
    if (productName?.trim()) prefixes.push(`${PRODUCT_IMAGE_FOLDER}/${productName.trim()}/Variant/${variantName.trim()}`);
    if (productId?.trim()) prefixes.push(`${PRODUCT_IMAGE_FOLDER}/${productId.trim()}/Variant/${variantName.trim()}`);

    for (const prefix of prefixes) {
      const keys = await this.s3Service.listKeys(prefix);
      if (keys.length > 0) {
        const imageKeys = keys.filter((k) => {
          const lower = k.toLowerCase();
          return IMAGE_EXTENSIONS.some((ext) => lower.endsWith(`.${ext}`));
        });

        const mainKey =
          imageKeys.find((k) => k.toLowerCase().includes('main')) || imageKeys[0];

        if (mainKey) {
          return {
            mainImage: this.s3Service.getPublicUrl(mainKey),
            galleryImages: productBundle.galleryImages,
          };
        }
      }

      const variantMainImage = await this.resolveVariantImage(prefix);
      if (variantMainImage) {
        return {
          mainImage: variantMainImage,
          galleryImages: productBundle.galleryImages,
        };
      }
    }

    return {
      mainImage: productBundle.mainImage,
      galleryImages: productBundle.galleryImages,
    };
  }

  /** @deprecated Use resolveProductImages().mainImage */
  async resolveMainImageUrl(nameOrSlug: string): Promise<string | null> {
    const bundle = await this.resolveProductImages(nameOrSlug);
    return bundle.mainImage;
  }

  // =======================
  // 🔐 INTERNAL FALLBACKS
  // =======================

  private async resolveMainImageAtPrefix(prefix: string): Promise<string | null> {
    const fileNames = ['main', 'Main'];

    for (const fileName of fileNames) {
      for (const extension of IMAGE_EXTENSIONS) {
        const key = `${prefix}/${fileName}.${extension}`;
        const exists = await this.s3Service.objectExists(key);
        if (exists) {
          return this.s3Service.getPublicUrl(key);
        }
      }
    }

    return null;
  }

  private async resolveVariantImage(prefix: string): Promise<string | null> {
    for (const extension of IMAGE_EXTENSIONS) {
      const key = `${prefix}.${extension}`;
      const exists = await this.s3Service.objectExists(key);
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
          return this.s3Service.getPublicUrl(key);
        }
      }
    }

    return null;
  }
}
