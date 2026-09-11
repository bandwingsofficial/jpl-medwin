import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';
import { HttpStatus } from '@nestjs/common';

export class EmailOtpRequiredException extends BaseException {
  constructor() {
    super(
      'Email OTP verification must be completed first.',
      ErrorCode.AUTH.EMAIL_OTP_REQUIRED,
      HttpStatus.FORBIDDEN,
    );
  }
}
