// src/modules/order/domain/exceptions/order-not-found.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class OrderNotFoundException extends BaseException {
  constructor(details?: {
    orderId?: string;

    orderNumber?: string;
  }) {
    super('Order not found', ErrorCode.ORDER.NOT_FOUND, HttpStatus.NOT_FOUND, details);
  }
}
