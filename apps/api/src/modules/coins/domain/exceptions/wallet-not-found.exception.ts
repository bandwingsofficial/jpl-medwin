import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class WalletNotFoundException extends BaseException {
  constructor(details?: { walletId?: string; userId?: string; message?: string }) {
    super(
      details?.message || 'Coin wallet not found',
      ErrorCode.COINS.WALLET_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      details,
    );
  }
}
