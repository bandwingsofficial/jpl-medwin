// src/modules/checkout-session/domain/exceptions/checkout-session-expired.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class CheckoutSessionExpiredException extends BaseException {
  constructor(details?: { checkoutSessionId?: string }) {
    super(
      'Checkout session expired',

      ErrorCode.CHECKOUT_SESSION.EXPIRED,

      HttpStatus.GONE,

      details,
    );
  }
}
