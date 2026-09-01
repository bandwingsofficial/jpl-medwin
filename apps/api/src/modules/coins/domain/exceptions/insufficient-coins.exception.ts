import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class InsufficientCoinsException extends BaseException {
  constructor(details?: {
    availableCoins?: number;
    requestedCoins?: number;
    userId?: string;
    message?: string;
  }) {
    super(
      details?.message || 'Insufficient coins balance',
      ErrorCode.COINS.INSUFFICIENT_COINS,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}
