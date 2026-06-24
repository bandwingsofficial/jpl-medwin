import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class InvalidRedemptionException extends BaseException {
  constructor(details?: {requestedCoins?: number;minimumOrderAmount?: number;maxRedemptionAmount?: number;field?: string;message?: string;}) {
    super(
      details?.message || 'Invalid coin redemption request',
      ErrorCode.COINS.INVALID_REDEMPTION,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}
