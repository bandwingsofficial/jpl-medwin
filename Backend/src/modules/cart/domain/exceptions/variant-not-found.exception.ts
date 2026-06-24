// src/modules/product/domain/exceptions/variant-not-found.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class VariantNotFoundException extends BaseException {
  constructor(details?: {
    variantId?: string;

    productId?: string;
  }) {
    super(
      'Variant not found',

      ErrorCode.PRODUCT.VARIANT_NOT_FOUND,

      HttpStatus.NOT_FOUND,

      details,
    );
  }
}