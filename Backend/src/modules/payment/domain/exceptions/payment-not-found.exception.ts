// src/modules/payment/domain/exceptions/payment-not-found.exception.ts

import { NotFoundException } from '@nestjs/common';

export class PaymentNotFoundException extends NotFoundException {
  constructor(details?: Record<string, any>) {
    super({
      success: false,

      message: 'Payment not found',

      errorCode: 'PAYMENT.NOT_FOUND',

      details,
    });
  }
}
