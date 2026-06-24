// src/modules/order/domain/exceptions/order-already-shipped.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class OrderAlreadyShippedException extends BaseException {
  constructor(details?: { orderId?: string }) {
    super('Order already shipped', ErrorCode.ORDER.ALREADY_SHIPPED, HttpStatus.CONFLICT, details);
  }
}
