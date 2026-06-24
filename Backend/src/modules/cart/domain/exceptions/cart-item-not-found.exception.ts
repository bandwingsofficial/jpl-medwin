// src/modules/cart/domain/exceptions/cart-item-not-found.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class CartItemNotFoundException extends BaseException {
  constructor(details?: {
    cartItemId?: string;

    variantId?: string;
  }) {
    super(
      'Cart item not found',

      ErrorCode.CART.ITEM_NOT_FOUND,

      HttpStatus.NOT_FOUND,

      details,
    );
  }
}
