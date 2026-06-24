// src/modules/order/domain/exceptions/invalid-order-operation.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class InvalidOrderOperationException extends BaseException {
  constructor(details?: {
    orderId?: string;

    operation?: string;

    reason?: string;
  }) {
    super(
      'Invalid order operation',
      ErrorCode.ORDER.INVALID_OPERATION,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}
