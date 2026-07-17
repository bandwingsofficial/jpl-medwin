// src/modules/order/domain/exceptions/order-already-delivered.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class OrderAlreadyDeliveredException extends BaseException {
  constructor(details?: { orderId?: string }) {
    super(
      'Order already delivered',
      ErrorCode.ORDER.ALREADY_DELIVERED,
      HttpStatus.CONFLICT,
      details,
    );
  }
}
