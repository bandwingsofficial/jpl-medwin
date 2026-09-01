import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class OtpCooldownActiveException extends BaseException {
  constructor(details?: {
    identifier?: string;
    purpose?: string;
    retryAfter?: number; // seconds
    remainingSendAttempts?: number; // ✅ FIXED
  }) {
    super('OTP cooldown active', ErrorCode.OTP.COOLDOWN_ACTIVE, HttpStatus.TOO_MANY_REQUESTS, {
      identifier: details?.identifier,
      purpose: details?.purpose,
      retryAfter: details?.retryAfter,
      remainingSendAttempts: details?.remainingSendAttempts, // ✅ FIXED
    });
  }
}
