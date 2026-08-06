// src/modules/cart/domain/exceptions/cart-item-out-of-stock.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class CartItemOutOfStockException extends BaseException {
  constructor(details?: {
    variantId?: string;

    requestedQuantity?: number;

    availableQuantity?: number;
  }) {
    super(
      'Item out of stock',

      ErrorCode.CART.ITEM_OUT_OF_STOCK,

      HttpStatus.BAD_REQUEST,

      details,
    );
  }
}
