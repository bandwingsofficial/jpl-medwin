// src/modules/cart/domain/exceptions/invalid-cart-operation.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class InvalidCartOperationException extends BaseException {
  constructor(details?: {
    cartId?: string;

    operation?: string;
  }) {
    super(
      'Invalid cart operation',

      ErrorCode.CART.INVALID_OPERATION,

      HttpStatus.BAD_REQUEST,

      details,
    );
  }
}
