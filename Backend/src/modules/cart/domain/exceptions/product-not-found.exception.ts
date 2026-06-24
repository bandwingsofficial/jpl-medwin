// src/modules/product/domain/exceptions/product-not-found.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class ProductNotFoundException extends BaseException {
  constructor(details?: {
    productId?: string;
  }) {
    super(
      'Product not found',

      ErrorCode.PRODUCT.NOT_FOUND,

      HttpStatus.NOT_FOUND,

      details,
    );
  }
}