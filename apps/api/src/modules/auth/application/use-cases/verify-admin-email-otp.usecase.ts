import { Injectable, BadRequestException } from '@nestjs/common';

import { AuthDomainService } from '@/domain/services/auth.domain.service';
import { AdminChallengeStore } from '@/infrastructure/redis/admin-challenge.store';

import { ChallengeExpiredException } from '@/domain/exceptions/admin/challenge-expired.exception';
import { EmailOtpExpiredException } from '@/domain/exceptions/admin/email-otp-expired.exception';
import { EmailOtpInvalidException } from '@/domain/exceptions/admin/email-otp-invalid.exception';
import { EmailOtpMaxAttemptsException } from '@/domain/exceptions/admin/email-otp-max-attempts.exception';

@Injectable()
export class VerifyAdminEmailOtpUseCase {
  private readonly MAX_ATTEMPTS = 5;

  constructor(
    private readonly adminChallengeStore: AdminChallengeStore,
    private readonly authService: AuthDomainService,
  ) {}

  async execute(dto: { challengeId: string; otp: string }) {
    if (!dto?.challengeId || !dto?.otp) {
      throw new BadRequestException({
        message: 'challengeId and otp are required',
        errorCode: 'VALIDATION_ERROR',
      });
    }

    const challenge = await this.adminChallengeStore.getChallenge(dto.challengeId);

    if (!challenge) {
      throw new ChallengeExpiredException();
    }

    if (challenge.emailOtpVerified) {
      return {
        message: 'Email OTP already verified',
        challengeId: challenge.challengeId,
        emailOtpVerified: true,
        step: 'TOTP',
      };
    }

    if (Date.now() > challenge.otpExpiresAt) {
      throw new EmailOtpExpiredException();
    }

    if (challenge.attempts >= this.MAX_ATTEMPTS) {
      await this.adminChallengeStore.deleteChallenge(dto.challengeId);
      throw new EmailOtpMaxAttemptsException();
    }

    const isValid = this.authService.verifyOtpHash(dto.otp, challenge.otpHash);

    if (!isValid) {
      const attempts = await this.adminChallengeStore.incrementAttempts(dto.challengeId);

      if (attempts >= this.MAX_ATTEMPTS) {
        await this.adminChallengeStore.deleteChallenge(dto.challengeId);
        throw new EmailOtpMaxAttemptsException();
      }

      throw new EmailOtpInvalidException({
        remainingAttempts: Math.max(0, this.MAX_ATTEMPTS - attempts),
      });
    }

    // Mark verified and invalidate OTP hash to prevent replay
    await this.adminChallengeStore.markEmailOtpVerified(dto.challengeId, 300);

    return {
      message: 'Email verification successful',
      challengeId: challenge.challengeId,
      emailOtpVerified: true,
      step: 'TOTP',
    };
  }
}
