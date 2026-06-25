// src/modules/wishlist/domain/exceptions/wishlist-not-found.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class WishlistNotFoundException extends BaseException {
  constructor(details?: {
    wishlistId?: string;

    userId?: string;

    productId?: string;
  }) {
    super(
      'Wishlist item not found',

      ErrorCode.WISHLIST.NOT_FOUND,

      HttpStatus.NOT_FOUND,

      details,
    );
  }
}
