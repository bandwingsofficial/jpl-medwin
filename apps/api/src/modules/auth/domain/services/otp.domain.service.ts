import { OTP_POLICY } from '../policies/otp.policy';

import { InvalidOtpException } from '../exceptions/otp/invalid-otp.exception';
import { OtpExpiredException } from '../exceptions/otp/otp-expired.exception';
import { OtpMaxAttemptsExceededException } from '../exceptions/otp/otp-max-attempts.exception';
import { OtpCooldownActiveException } from '../exceptions/otp/otp-cooldown-active.exception';

import { OtpCodeVO } from '../value-objects/otp-code.vo';

export class OtpDomainService {
  // =======================
  // GENERATE
  // =======================

  generateCode(): string {
    const min = 10 ** (OTP_POLICY.LENGTH - 1);
    const max = 10 ** OTP_POLICY.LENGTH - 1;

    return Math.floor(min + Math.random() * (max - min)).toString();
  }

  // =======================
  // VALIDATE FORMAT
  // =======================

  validateFormat(code: string): OtpCodeVO {
    return new OtpCodeVO(code);
  }

  // =======================
  // VALIDATE OTP (VERIFY FLOW ONLY)
  // =======================

  validateOtp(params: {
    storedCode: string;
    inputCode: string;
    verifyAttempts: number;
    expiresAt: Date;
    identifier?: string;
    purpose?: string;
  }): void {
    const { storedCode, inputCode, verifyAttempts, expiresAt, identifier, purpose } = params;

    // ❌ Expired
    if (new Date() > expiresAt) {
      throw new OtpExpiredException({ identifier, purpose });
    }

    // ❌ Max attempts reached
    if (verifyAttempts >= OTP_POLICY.MAX_ATTEMPTS) {
      throw new OtpMaxAttemptsExceededException({
        identifier,
        purpose,
        remainingVerifyAttempts: 0, // ✅ FIXED
      });
    }

    // ❌ Invalid OTP
    if (storedCode !== inputCode.trim()) {
      const remainingVerifyAttempts = OTP_POLICY.MAX_ATTEMPTS - verifyAttempts;

      throw new InvalidOtpException({
        identifier,
        purpose,
        remainingVerifyAttempts, // ✅ FIXED
      });
    }

    // ✅ Valid
  }

  // =======================
  // RESEND CHECK (SEND FLOW ONLY)
  // =======================

  checkCooldown(params: {
    retryAfter: number;
    identifier?: string;
    purpose?: string;
    remainingSendAttempts?: number;
  }): void {
    const { retryAfter, identifier, purpose, remainingSendAttempts } = params;

    if (retryAfter > 0) {
      throw new OtpCooldownActiveException({
        identifier,
        purpose,
        retryAfter,
        remainingSendAttempts, // ✅ keep naming consistent
      });
    }
  }
}
