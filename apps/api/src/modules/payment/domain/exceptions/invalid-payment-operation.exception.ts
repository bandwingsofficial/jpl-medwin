// src/modules/payment/domain/exceptions/invalid-payment-operation.exception.ts

import { BadRequestException } from '@nestjs/common';

export class InvalidPaymentOperationException extends BadRequestException {
  constructor(details?: Record<string, any>) {
    super({
      success: false,

      message: 'Invalid payment operation',

      errorCode: 'PAYMENT.INVALID_OPERATION',

      details,
    });
  }
}
