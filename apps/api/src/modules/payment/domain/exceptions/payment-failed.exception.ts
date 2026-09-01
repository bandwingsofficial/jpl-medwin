// src/modules/payment/domain/exceptions/payment-failed.exception.ts

import { BadRequestException } from '@nestjs/common';

export class PaymentFailedException extends BadRequestException {
  constructor(details?: Record<string, any>) {
    super({
      success: false,

      message: 'Payment failed',

      errorCode: 'PAYMENT.FAILED',

      details,
    });
  }
}
