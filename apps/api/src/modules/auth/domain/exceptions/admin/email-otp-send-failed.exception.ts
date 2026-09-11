import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';
import { HttpStatus } from '@nestjs/common';

export class EmailOtpSendFailedException extends BaseException {
  constructor() {
    super(
      'Failed to deliver verification code email. Please try again.',
      ErrorCode.AUTH.EMAIL_OTP_SEND_FAILED,
      HttpStatus.BAD_GATEWAY,
    );
  }
}
