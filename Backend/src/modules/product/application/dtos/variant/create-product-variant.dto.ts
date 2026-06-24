// src/modules/product/application/dtos/variant/create-product-variant.dto.ts

import { VariantImageDto } from './variant-image.dto';

export class CreateProductVariantDto {
  id?: string;

  name?: string;

  sku?: string;

  barcode?: string;

  purchasePrice?: number;

  sellingPrice?: number;

  mrp?: number;

  quantity?: number;

  attributes?: Record<string, any>;

  mainImage?: string;

  images?: VariantImageDto[];

  isWeighted?: boolean;

  warrantyMonths?: number;

  averageRating?: number;

  reviewCount?: number;
}
