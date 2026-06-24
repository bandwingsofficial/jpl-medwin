// src/modules/cart/domain/exceptions/cart-item-already-exists.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class CartItemAlreadyExistsException extends BaseException {
  constructor(details?: {
    variantId?: string;

    cartId?: string;
  }) {
    super(
      'Cart item already exists',

      ErrorCode.CART.ITEM_ALREADY_EXISTS,

      HttpStatus.CONFLICT,

      details,
    );
  }
}
