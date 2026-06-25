import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class ReturnAlreadyApprovedException extends BaseException {
  constructor(details?: { returnId?: string }) {
    super(
      'Return already approved',
      ErrorCode.RETURN.ALREADY_APPROVED,
      HttpStatus.CONFLICT,
      details,
    );
  }
}
