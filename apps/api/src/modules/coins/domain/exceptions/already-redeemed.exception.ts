import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class AlreadyRedeemedException extends BaseException {
  constructor(details?: { orderId?: string; message?: string }) {
    super(
      details?.message || 'Coins already redeemed for this order',
      ErrorCode.COINS.ALREADY_REDEEMED,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}
