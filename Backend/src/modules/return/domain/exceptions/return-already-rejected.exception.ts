import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class ReturnAlreadyRejectedException extends BaseException {
  constructor(details?: { returnId?: string }) {
    super(
      'Return already rejected',
      ErrorCode.RETURN.ALREADY_REJECTED,
      HttpStatus.CONFLICT,
      details,
    );
  }
}