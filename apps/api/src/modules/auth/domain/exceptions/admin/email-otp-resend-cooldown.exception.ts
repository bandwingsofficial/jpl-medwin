import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';
import { HttpStatus } from '@nestjs/common';

export class EmailOtpResendCooldownException extends BaseException {
  constructor(details?: { retryAfter?: number }) {
    super(
      'Please wait before requesting another verification code.',
      ErrorCode.AUTH.EMAIL_OTP_RESEND_COOLDOWN,
      HttpStatus.TOO_MANY_REQUESTS,
      details,
    );
  }
}
