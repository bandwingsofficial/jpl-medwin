// src/modules/cart/domain/exceptions/cart-already-merged.exception.ts

import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class CartAlreadyMergedException extends BaseException {
  constructor(details?: { cartId?: string }) {
    super(
      'Cart already merged',
      ErrorCode.CART.ALREADY_MERGED,
      HttpStatus.CONFLICT,
      details,
    );
  }
}
