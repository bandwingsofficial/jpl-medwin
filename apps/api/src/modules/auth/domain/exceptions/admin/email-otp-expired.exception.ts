import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';
import { HttpStatus } from '@nestjs/common';

export class EmailOtpExpiredException extends BaseException {
  constructor() {
    super(
      'Verification code has expired. Please request a new one.',
      ErrorCode.AUTH.EMAIL_OTP_EXPIRED,
      HttpStatus.BAD_REQUEST,
    );
  }
}
