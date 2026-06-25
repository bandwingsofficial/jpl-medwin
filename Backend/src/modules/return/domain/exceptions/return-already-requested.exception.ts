import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class ReturnAlreadyRequestedException extends BaseException {
  constructor(details?: { orderId?: string }) {
    super(
      'Return request already exists',
      ErrorCode.RETURN.ALREADY_REQUESTED,
      HttpStatus.CONFLICT,
      details,
    );
  }
}
