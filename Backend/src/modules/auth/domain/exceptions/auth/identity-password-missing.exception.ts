import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class IdentityPasswordMissingException extends BaseException {
  constructor(details?: any) {
    super('Password not set for this identity', ErrorCode.IDENTITY.PASSWORD_MISSING, 400, details);
  }
}
