import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class InvalidOtpException extends BaseException {
  constructor(details?: {
    identifier?: string;
    purpose?: string;
    channel?: 'PHONE' | 'EMAIL';
    remainingVerifyAttempts?: number; // ✅ renamed
  }) {
    const message =
      details?.channel === 'PHONE'
        ? 'Invalid OTP for phone number'
        : details?.channel === 'EMAIL'
          ? 'Invalid OTP for email'
          : 'Invalid OTP';

    super(message, ErrorCode.OTP.INVALID, HttpStatus.BAD_REQUEST, {
      identifier: details?.identifier,
      purpose: details?.purpose,
      remainingVerifyAttempts: details?.remainingVerifyAttempts, // ✅ fixed
    });
  }
}
