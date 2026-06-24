// src/modules/order/domain/exceptions/order-already-completed.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class OrderAlreadyCompletedException extends BaseException {
  constructor(details?: { orderId?: string }) {
    super(
      'Order already completed',
      ErrorCode.ORDER.ALREADY_COMPLETED,
      HttpStatus.CONFLICT,
      details,
    );
  }
}
