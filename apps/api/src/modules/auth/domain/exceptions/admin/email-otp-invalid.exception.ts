import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';
import { HttpStatus } from '@nestjs/common';

export class EmailOtpInvalidException extends BaseException {
  constructor(details?: { remainingAttempts?: number }) {
    super(
      'Invalid verification code',
      ErrorCode.AUTH.EMAIL_OTP_INVALID,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}
