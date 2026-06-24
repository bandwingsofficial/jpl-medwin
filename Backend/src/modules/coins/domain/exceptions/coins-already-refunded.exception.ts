import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class CoinsAlreadyRefundedException extends BaseException {
  constructor(details?: { message?: string; transactionId?: string }) {
    super(
      details?.message || 'Coins have already been refunded for this transaction',
      ErrorCode.COINS.COINS_ALREADY_REFUNDED,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}