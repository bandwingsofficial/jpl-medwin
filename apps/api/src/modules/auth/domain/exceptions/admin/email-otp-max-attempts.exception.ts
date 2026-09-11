import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';
import { HttpStatus } from '@nestjs/common';

export class EmailOtpMaxAttemptsException extends BaseException {
  constructor() {
    super(
      'Maximum verification attempts exceeded. Please restart login.',
      ErrorCode.AUTH.EMAIL_OTP_MAX_ATTEMPTS,
      HttpStatus.BAD_REQUEST,
    );
  }
}
