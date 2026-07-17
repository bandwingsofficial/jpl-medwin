// src/modules/coupon/domain/exceptions/coupon-not-active.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class CouponNotActiveException extends BaseException {
  constructor(details?: {
    couponId?: string;

    couponCode?: string;
  }) {
    super('Coupon is not active', ErrorCode.COUPON.NOT_ACTIVE, HttpStatus.BAD_REQUEST, details);
  }
}
