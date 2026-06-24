// src/modules/coupon/domain/exceptions/minimum-order-not-reached.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class MinimumOrderNotReachedException extends BaseException {
  constructor(details?: {
    minimumOrderAmount?: number;

    currentSubtotal?: number;
  }) {
    super(
      'Minimum order amount not reached',
      ErrorCode.COUPON.MINIMUM_ORDER_NOT_REACHED,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}
