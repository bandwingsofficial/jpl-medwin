import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class SessionNotFoundException extends BaseException {
  constructor(details?: { sessionId?: string; userId?: string }) {
    super('Session not found', ErrorCode.SESSION.NOT_FOUND, HttpStatus.NOT_FOUND, details);
  }
}
