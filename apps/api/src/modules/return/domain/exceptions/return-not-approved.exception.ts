import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class ReturnNotApprovedException extends BaseException {
  constructor(details?: { returnId?: string }) {
    super(
      'Return must be approved first',
      ErrorCode.RETURN.NOT_APPROVED,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}
