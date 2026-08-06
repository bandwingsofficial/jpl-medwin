// src/modules/order/domain/exceptions/order-cancelled.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class OrderCancelledException extends BaseException {
  constructor(details?: { orderId?: string }) {
    super('Order has been cancelled', ErrorCode.ORDER.CANCELLED, HttpStatus.CONFLICT, details);
  }
}
