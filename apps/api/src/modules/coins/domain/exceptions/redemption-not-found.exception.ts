import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class RedemptionNotFoundException extends BaseException {
  constructor(details?: { redemptionId?: string; orderId?: string; message?: string }) {
    super(
      details?.message || 'Redemption transaction not found',
      ErrorCode.COINS.REDEMPTION_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      details,
    );
  }
}
