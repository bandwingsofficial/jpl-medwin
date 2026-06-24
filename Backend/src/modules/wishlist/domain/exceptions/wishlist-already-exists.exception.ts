// src/modules/wishlist/domain/exceptions/wishlist-already-exists.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class WishlistAlreadyExistsException extends BaseException {
  constructor(details?: {
    userId?: string;
    productId?: string;
  }) {
    super(
      'Product already exists in wishlist',

      ErrorCode.WISHLIST.ALREADY_EXISTS,

      HttpStatus.CONFLICT,

      details,
    );
  }
}