// src/modules/coupon/domain/exceptions/coupon-code-already-exists.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class CouponCodeAlreadyExistsException extends BaseException {
  constructor(details?: { couponCode?: string }) {
    super(
      'Coupon code already exists',
      ErrorCode.COUPON.CODE_ALREADY_EXISTS,
      HttpStatus.CONFLICT,
      details,
    );
  }
}
