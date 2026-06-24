import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class InvalidWalletQueryException extends BaseException {
  constructor(details?: { walletId?: string; userId?: string; message?: string }) {
    super(
      details?.message || 'walletId or userId is required',
      ErrorCode.COINS.INVALID_WALLET_QUERY,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}
