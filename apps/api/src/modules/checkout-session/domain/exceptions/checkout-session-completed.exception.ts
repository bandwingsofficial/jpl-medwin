// src/modules/checkout-session/domain/exceptions/checkout-session-completed.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class CheckoutSessionCompletedException extends BaseException {
  constructor(details?: { checkoutSessionId?: string }) {
    super(
      'Checkout session already completed',

      ErrorCode.CHECKOUT_SESSION.ALREADY_COMPLETED,

      HttpStatus.CONFLICT,

      details,
    );
  }
}
