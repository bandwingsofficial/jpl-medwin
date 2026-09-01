// src/modules/checkout-session/domain/exceptions/invalid-checkout-session.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class InvalidCheckoutSessionException extends BaseException {
  constructor(details?: {
    checkoutSessionId?: string;

    reason?: string;
  }) {
    super(
      'Invalid checkout session',

      ErrorCode.CHECKOUT_SESSION.INVALID,

      HttpStatus.BAD_REQUEST,

      details,
    );
  }
}
