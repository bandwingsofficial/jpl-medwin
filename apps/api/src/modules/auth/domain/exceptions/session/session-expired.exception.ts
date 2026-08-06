import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class SessionExpiredException extends BaseException {
  constructor(details?: { sessionId?: string; deviceId?: string; userId?: string }) {
    super('Session expired', ErrorCode.SESSION.EXPIRED, HttpStatus.UNAUTHORIZED, details);
  }
}
