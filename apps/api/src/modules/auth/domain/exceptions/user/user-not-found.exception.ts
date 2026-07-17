import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class UserNotFoundException extends BaseException {
  constructor(details?: { userId?: string }) {
    super('User not found', ErrorCode.USER.NOT_FOUND, HttpStatus.NOT_FOUND, details);
  }
}
