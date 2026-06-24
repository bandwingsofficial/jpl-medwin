import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class ReturnAlreadyCompletedException extends BaseException {
  constructor(details?: { returnId?: string }) {
    super(
      'Return already completed',
      ErrorCode.RETURN.ALREADY_COMPLETED,
      HttpStatus.CONFLICT,
      details,
    );
  }
}