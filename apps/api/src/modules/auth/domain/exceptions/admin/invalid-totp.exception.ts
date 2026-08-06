import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';
import { HttpStatus } from '@nestjs/common';

export class InvalidTotpException extends BaseException {
  constructor() {
    super('Invalid TOTP code', ErrorCode.AUTH.INVALID_TOTP, HttpStatus.UNAUTHORIZED);
  }
}
