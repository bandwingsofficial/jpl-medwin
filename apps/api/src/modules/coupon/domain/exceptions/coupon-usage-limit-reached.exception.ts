// src/modules/coupon/domain/exceptions/coupon-usage-limit-reached.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class CouponUsageLimitReachedException extends BaseException {
  constructor(details?: {
    couponId?: string;

    couponCode?: string;

    usageLimit?: number;
  }) {
    super(
      'You have already used this coupon',
      ErrorCode.COUPON.USAGE_LIMIT_REACHED,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}
