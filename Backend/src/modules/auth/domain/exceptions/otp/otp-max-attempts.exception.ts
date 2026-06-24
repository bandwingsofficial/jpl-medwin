import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class OtpMaxAttemptsExceededException extends BaseException {
  constructor(details?: {
    identifier?: string;
    purpose?: string;
    remainingVerifyAttempts?: number; // ✅ FIXED
    blockedUntil?: Date;
  }) {
    super(
      'OTP attempts exceeded',
      ErrorCode.OTP.MAX_ATTEMPTS_EXCEEDED,
      HttpStatus.TOO_MANY_REQUESTS,
      {
        identifier: details?.identifier,
        purpose: details?.purpose,
        remainingVerifyAttempts: details?.remainingVerifyAttempts, // ✅ FIXED
        blockedUntil: details?.blockedUntil,
      },
    );
  }
}
