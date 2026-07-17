import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';
import { HttpStatus } from '@nestjs/common';

export class InvalidCredentialsException extends BaseException {
  constructor() {
    super('Invalid email or password', ErrorCode.AUTH.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
  }
}
