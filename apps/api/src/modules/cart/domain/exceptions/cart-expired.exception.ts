// src/modules/cart/domain/exceptions/cart-expired.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class CartExpiredException extends BaseException {
  constructor(details?: { cartId?: string }) {
    super(
      'Cart has expired',

      ErrorCode.CART.EXPIRED,

      HttpStatus.GONE,

      details,
    );
  }
}
