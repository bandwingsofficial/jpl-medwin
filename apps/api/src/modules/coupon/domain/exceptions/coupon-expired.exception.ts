// src/modules/coupon/domain/exceptions/coupon-expired.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class CouponExpiredException extends BaseException {
  constructor(details?: {
    couponId?: string;

    couponCode?: string;

    expiresAt?: Date;
  }) {
    super('Coupon has expired', ErrorCode.COUPON.EXPIRED, HttpStatus.BAD_REQUEST, details);
  }
}
