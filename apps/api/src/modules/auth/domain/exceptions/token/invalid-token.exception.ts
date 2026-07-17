import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class InvalidTokenException extends BaseException {
  constructor(details?: { reason?: 'MALFORMED' | 'SIGNATURE_INVALID' | 'EXPIRED' }) {
    super('Invalid token', ErrorCode.AUTH.INVALID_TOKEN, HttpStatus.UNAUTHORIZED, details);
  }
}
