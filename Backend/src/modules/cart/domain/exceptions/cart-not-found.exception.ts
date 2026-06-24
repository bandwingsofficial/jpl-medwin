// src/modules/cart/domain/exceptions/cart-not-found.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class CartNotFoundException extends BaseException {
  constructor(details?: { cartId?: string; userId?: string; guestId?: string }) {
    super('Cart not found', ErrorCode.CART.NOT_FOUND, HttpStatus.NOT_FOUND, details);
  }
}
