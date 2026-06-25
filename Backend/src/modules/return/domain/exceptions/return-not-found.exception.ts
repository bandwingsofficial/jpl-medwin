import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class ReturnNotFoundException extends BaseException {
  constructor(details?: { returnId?: string }) {
    super('Return request not found', ErrorCode.RETURN.NOT_FOUND, HttpStatus.NOT_FOUND, details);
  }
}
