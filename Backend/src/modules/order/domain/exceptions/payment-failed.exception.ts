// src/modules/order/domain/exceptions/payment-failed.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class PaymentFailedException extends BaseException {
  constructor(details?: {
    orderId?: string;

    paymentId?: string;

    reason?: string;
  }) {
    super('Payment failed', ErrorCode.ORDER.PAYMENT_FAILED, HttpStatus.PAYMENT_REQUIRED, details);
  }
}
