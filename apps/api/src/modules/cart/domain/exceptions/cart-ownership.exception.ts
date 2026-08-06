// src/modules/cart/domain/exceptions/cart-ownership.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class CartOwnershipException extends BaseException {
  constructor(details?: {
    cartId?: string;

    userId?: string;
  }) {
    super(
      'You do not have access to this cart',

      ErrorCode.CART.INVALID_OWNER,

      HttpStatus.FORBIDDEN,

      details,
    );
  }
}
