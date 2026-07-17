// src/modules/checkout-session/domain/exceptions/checkout-session-not-found.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class CheckoutSessionNotFoundException extends BaseException {
  constructor(details?: { checkoutSessionId?: string }) {
    super(
      'Checkout session not found',

      ErrorCode.CHECKOUT_SESSION.NOT_FOUND,

      HttpStatus.NOT_FOUND,

      details,
    );
  }
}
