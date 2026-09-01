import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class InvalidRefundAmountException extends BaseException {
  constructor(details?: { redeemedCoins?: number; refundCoins?: number; message?: string }) {
    super(
      details?.message || 'Refund coins cannot exceed redeemed coins',
      ErrorCode.COINS.INVALID_REFUND_AMOUNT,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}
