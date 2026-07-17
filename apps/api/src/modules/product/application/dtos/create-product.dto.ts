// src/modules/product/application/dtos/create-product.dto.ts

import { ProductStatus } from '../../domain/enums/product-status.enum';

import { ProductType } from '../../domain/enums/product-type.enum';

import { ProductImageDto } from './common/product-image.dto';

import { ProductFaqDto } from './common/product-faq.dto';

import { ProductSpecificationDto } from './common/product-specification.dto';

import { ProductAdditionalInfoDto } from './common/product-additional-info.dto';

import { CreateProductVariantDto } from './variant/create-product-variant.dto';

export class CreateProductDto {
  // =======================
  // BASIC
  // =======================

  name?: string;

  type?: ProductType;

  status?: ProductStatus;

  categoryId?: string;

  subCategoryId?: string;

  miniCategoryId?: string;

  brandId?: string;

  shortDescription?: string;

  longDescription?: string;

  // =======================
  // MEDIA
  // =======================

  mainImage?: string;

  images?: ProductImageDto[];

  // =======================
  // ARRAYS
  // =======================

  features?: string[];

  tags?: string[];

  displayNotes?: string[];

  packing?: string[];

  directionOfUse?: string[];

  // =======================
  // OBJECT ARRAYS
  // =======================

  specifications?: ProductSpecificationDto[];

  additionalInfo?: ProductAdditionalInfoDto[];

  faq?: ProductFaqDto[];

  // =======================
  // PRODUCT FLAGS
  // =======================

  isWeighted?: boolean;

  warrantyMonths?: number;

  // =======================
  // VARIANTS
  // =======================

  variants?: CreateProductVariantDto[];
}
