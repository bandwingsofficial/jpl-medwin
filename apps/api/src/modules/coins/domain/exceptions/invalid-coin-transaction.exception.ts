import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class InvalidCoinTransactionException extends BaseException {
  constructor(details?: { message?: string }) {
    super(
      details?.message || 'Invalid coin transaction',
      ErrorCode.COINS.INVALID_COIN_TRANSACTION,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}
