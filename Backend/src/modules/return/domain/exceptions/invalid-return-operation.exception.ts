import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class InvalidReturnOperationException extends BaseException {
  constructor(details?: {
    returnId?: string;

    operation?: string;

    reason?: string;
  }) {
    super(
      'Invalid return operation',
      ErrorCode.RETURN.INVALID_OPERATION,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}