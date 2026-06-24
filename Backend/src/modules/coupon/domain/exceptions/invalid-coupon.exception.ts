// src/modules/coupon/domain/exceptions/invalid-coupon.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class InvalidCouponException extends BaseException {
  constructor(details?: {
    couponCode?: string;

    field?: string;

    message?: string;
  }) {
    super(
      details?.message || 'Invalid coupon',

      ErrorCode.COUPON.INVALID,

      HttpStatus.BAD_REQUEST,

      details,
    );
  }
}
