import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class CoinTransactionNotFoundException extends BaseException {
  constructor(details?: { transactionId?: string; message?: string }) {
    super(
      details?.message || 'Coin transaction not found',
      ErrorCode.COINS.COIN_TRANSACTION_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      details,
    );
  }
}
