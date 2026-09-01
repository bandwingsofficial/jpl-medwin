import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class RateLimitBlockedException extends BaseException {
  constructor(details: {
    identifier?: string;
    purpose?: string;
    blockedUntil: Date; // ✅ REQUIRED
    retryAfter: number; // ✅ REQUIRED
  }) {
    super(
      'Too many attempts. Try again later.',
      ErrorCode.RATELIMIT.BLOCKED,
      HttpStatus.TOO_MANY_REQUESTS,
      {
        identifier: details.identifier,
        purpose: details.purpose,
        blockedUntil: details.blockedUntil.toISOString(), // ✅ NO recompute
        retryAfter: details.retryAfter, // ✅ NO recompute
      },
    );
  }
}
