import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class InvalidSearchQueryException extends BaseException {
  constructor(details?: Record<string, any>) {
    super('Invalid search query', ErrorCode.SEARCH.INVALID_QUERY, HttpStatus.BAD_REQUEST, details);
  }
}
