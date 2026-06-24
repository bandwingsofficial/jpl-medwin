// src/modules/wishlist/domain/exceptions/wishlist-product-not-found.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class WishlistProductNotFoundException extends BaseException {
  constructor(details?: {
    productId?: string;
  }) {
    super(
      'Product not found',

      ErrorCode.WISHLIST.PRODUCT_NOT_FOUND,

      HttpStatus.NOT_FOUND,

      details,
    );
  }
}