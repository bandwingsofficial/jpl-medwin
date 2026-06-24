import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class UserInactiveException extends BaseException {
  constructor(details?: { userId?: string }) {
    super('User inactive', ErrorCode.USER.INACTIVE, HttpStatus.FORBIDDEN, details);
  }
}
