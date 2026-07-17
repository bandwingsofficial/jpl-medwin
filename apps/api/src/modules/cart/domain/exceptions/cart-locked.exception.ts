// src/modules/cart/domain/exceptions/cart-locked.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class CartLockedException extends BaseException {
  constructor(details?: { cartId?: string }) {
    super(
      'Cart is locked',

      ErrorCode.CART.LOCKED,

      HttpStatus.CONFLICT,

      details,
    );
  }
}
