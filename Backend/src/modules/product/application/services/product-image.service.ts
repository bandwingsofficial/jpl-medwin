import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ProductImageRepository } from '../../domain/repositories/product-image.repository';

import { Product } from '../../domain/entities/product.entity';
import { ProductImage } from '../../domain/entities/product-image.entity';

import { ImageOwnerType } from '../../domain/enums/image-owner-type.enum';
import { ImageType } from '../../domain/enums/image-type.enum';

import { ImageUrlVO } from '../../domain/value-objects/image-url.vo';

@Injectable()
export class ProductImageService {
  constructor(
    @Inject(TOKENS.PRODUCT_IMAGE_REPO)
    private readonly imageRepo: ProductImageRepository,
  ) {}

  async createProductImages(
    product: Product,

    input: {
      mainImage?: string;
      images?: {
        url: string;
        alt?: string;
        sortOrder?: number;
      }[];
    },

    tx?: any,
  ) {
    let productMainImageId: string | null = null;

    // Main image
    if (input.mainImage) {
      const img = await this.imageRepo.create(
        new ProductImage(
          crypto.randomUUID(),

          new ImageUrlVO(input.mainImage).getValue(),

          ImageType.MAIN,

          ImageOwnerType.PRODUCT,

          product.id,

          undefined,

          product.name,

          0,
        ),

        tx,
      );

      productMainImageId = img.id;
    }

    // Gallery images
    for (const img of input.images ?? []) {
      await this.imageRepo.create(
        new ProductImage(
          crypto.randomUUID(),

          new ImageUrlVO(img.url).getValue(),

          ImageType.GALLERY,

          ImageOwnerType.PRODUCT,

          product.id,

          undefined,

          img.alt,

          img.sortOrder ?? 0,
        ),

        tx,
      );
    }

    // Set main image
    if (productMainImageId) {
      await this.imageRepo.setMainImageForProduct(
        product.id,
        productMainImageId,
        tx,
      );
    }
  }
}