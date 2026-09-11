import { Injectable, Inject, BadRequestException, Logger } from '@nestjs/common';

import { AuthDomainService } from '@/domain/services/auth.domain.service';
import { AdminChallengeStore } from '@/infrastructure/redis/admin-challenge.store';
import { NotificationPort } from '@/application/ports/notification.port';
import { TOKENS } from '@/common/constants/tokens';

import { ChallengeExpiredException } from '@/domain/exceptions/admin/challenge-expired.exception';
import { EmailOtpResendCooldownException } from '@/domain/exceptions/admin/email-otp-resend-cooldown.exception';
import { EmailOtpSendFailedException } from '@/domain/exceptions/admin/email-otp-send-failed.exception';

@Injectable()
export class ResendAdminEmailOtpUseCase {
  private readonly logger = new Logger(ResendAdminEmailOtpUseCase.name);
  private readonly COOLDOWN_SECONDS = 60;
  private readonly EXPIRY_SECONDS = 300;

  constructor(
    private readonly adminChallengeStore: AdminChallengeStore,
    private readonly authService: AuthDomainService,

    @Inject(TOKENS.NOTIFICATION_PORT)
    private readonly notification: NotificationPort,
  ) {}

  async execute(dto: { challengeId: string }) {
    if (!dto?.challengeId) {
      throw new BadRequestException({
        message: 'challengeId is required',
        errorCode: 'VALIDATION_ERROR',
      });
    }

    const challenge = await this.adminChallengeStore.getChallenge(dto.challengeId);

    if (!challenge) {
      throw new ChallengeExpiredException();
    }

    if (challenge.emailOtpVerified) {
      throw new BadRequestException({
        message: 'Email OTP is already verified',
        errorCode: 'AUTH.ALREADY_VERIFIED',
      });
    }

    const elapsedSeconds = Math.floor((Date.now() - challenge.lastSentAt) / 1000);

    if (elapsedSeconds < this.COOLDOWN_SECONDS) {
      throw new EmailOtpResendCooldownException({
        retryAfter: this.COOLDOWN_SECONDS - elapsedSeconds,
      });
    }

    const newOtp = this.authService.generateSecureOtp();
    const newOtpHash = this.authService.hashOtp(newOtp);
    const newExpiresAt = Date.now() + this.EXPIRY_SECONDS * 1000;

    const emailSubject = 'JPL Medwin Admin - Verification Code';
    const emailBody = `Your Admin Panel verification code is ${newOtp}. This code expires in 5 minutes. If you did not attempt to sign in, please secure your account.`;

    try {
      await this.notification.sendEmail(challenge.email, emailSubject, emailBody);
    } catch (error) {
      this.logger.error(`Failed to resend Admin Email OTP for challenge ${dto.challengeId}`);
      throw new EmailOtpSendFailedException();
    }

    await this.adminChallengeStore.updateOtp(
      challenge.challengeId,
      newOtpHash,
      newExpiresAt,
      this.EXPIRY_SECONDS,
    );

    return {
      message: 'Verification code resent successfully',
      challengeId: challenge.challengeId,
      expiresIn: this.EXPIRY_SECONDS,
      resendCooldown: this.COOLDOWN_SECONDS,
    };
  }
}
