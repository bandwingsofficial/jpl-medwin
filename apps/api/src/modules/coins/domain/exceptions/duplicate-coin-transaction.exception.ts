import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class DuplicateCoinTransactionException extends BaseException {
  constructor(details?: { idempotencyKey?: string; message?: string }) {
    super(
      details?.message || 'Duplicate coin transaction detected',
      ErrorCode.COINS.DUPLICATE_COIN_TRANSACTION,
      HttpStatus.CONFLICT,
      details,
    );
  }
}
