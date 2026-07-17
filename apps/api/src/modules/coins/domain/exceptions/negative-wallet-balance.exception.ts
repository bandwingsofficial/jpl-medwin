import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class NegativeWalletBalanceException extends BaseException {
  constructor(details?: { walletId?: string; balance?: number; message?: string }) {
    super(
      details?.message || 'Wallet balance cannot be negative',
      ErrorCode.COINS.NEGATIVE_WALLET_BALANCE,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}
