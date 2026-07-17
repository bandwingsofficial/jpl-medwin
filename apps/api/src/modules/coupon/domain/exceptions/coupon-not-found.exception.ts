// src/modules/coupon/domain/exceptions/coupon-not-found.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class CouponNotFoundException extends BaseException {
  constructor(details?: {
    couponId?: string;

    couponCode?: string;
  }) {
    super('Coupon not found', ErrorCode.COUPON.NOT_FOUND, HttpStatus.NOT_FOUND, details);
  }
}
