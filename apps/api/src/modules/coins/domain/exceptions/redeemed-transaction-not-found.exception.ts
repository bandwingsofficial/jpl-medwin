import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class RedeemedTransactionNotFoundException extends BaseException {
  constructor(details?: { message?: string; transactionId?: string }) {
    super(
      details?.message || 'Redeemed transaction not found',
      ErrorCode.COINS.REDEEMED_TRANSACTION_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      details,
    );
  }
}
