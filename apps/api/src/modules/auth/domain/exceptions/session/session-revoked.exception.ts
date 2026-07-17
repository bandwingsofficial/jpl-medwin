import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class SessionRevokedException extends BaseException {
  constructor(details?: {
    userId?: string;
    sessionId?: string;
    deviceId?: string;
    reason?: 'LOGOUT' | 'ROTATED' | 'SECURITY';
  }) {
    super('Session revoked', ErrorCode.SESSION.REVOKED, HttpStatus.UNAUTHORIZED, details);
  }
}
