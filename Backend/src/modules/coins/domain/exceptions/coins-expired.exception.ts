import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class CoinsExpiredException extends BaseException {
  constructor(details?: {expiredCoins?: number;expiredAt?: Date;userId?: string;message?: string;}) {
    super(
      details?.message || 'Coins have expired',
      ErrorCode.COINS.COINS_EXPIRED,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}
