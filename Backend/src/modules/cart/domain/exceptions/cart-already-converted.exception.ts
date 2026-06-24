// src/modules/cart/domain/exceptions/cart-already-converted.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class CartAlreadyConvertedException extends BaseException {
  constructor(details?: { cartId?: string }) {
    super('Cart already converted', ErrorCode.CART.ALREADY_CONVERTED, HttpStatus.CONFLICT, details);
  }
}
