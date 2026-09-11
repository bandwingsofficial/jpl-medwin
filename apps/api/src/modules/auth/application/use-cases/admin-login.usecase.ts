import { Injectable, Inject, BadRequestException, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

import { AuthIdentityRepository } from '@/domain/repositories/auth-identity.repository';
import { UserRepository } from '@/domain/repositories/user.repository';
import { AuthDomainService } from '@/domain/services/auth.domain.service';
import { AdminChallengeStore } from '@/infrastructure/redis/admin-challenge.store';
import { NotificationPort } from '@/application/ports/notification.port';

import { TOKENS } from '@/common/constants/tokens';
import { AuthMethod } from '@/domain/enums/auth-method.enum';
import { maskEmail } from '@/common/utils/mask.util';

import { IdentityNotFoundException } from '@/domain/exceptions/auth/identity-not-found.exception';
import { UserNotFoundException } from '@/domain/exceptions/user/user-not-found.exception';
import { EmailOtpSendFailedException } from '@/domain/exceptions/admin/email-otp-send-failed.exception';

@Injectable()
export class AdminLoginUseCase {
  private readonly logger = new Logger(AdminLoginUseCase.name);

  constructor(
    @Inject(TOKENS.AUTH_IDENTITY_REPO)
    private readonly identityRepo: AuthIdentityRepository,

    @Inject(TOKENS.USER_REPO)
    private readonly userRepo: UserRepository,

    @Inject(TOKENS.NOTIFICATION_PORT)
    private readonly notification: NotificationPort,

    private readonly adminChallengeStore: AdminChallengeStore,
    private readonly authService: AuthDomainService,
  ) {}

  async execute(dto: {
    email: string;
    password: string;
    deviceId?: string;
    deviceName?: string;
    platform?: any;
    ip?: string;
    userAgent?: string;
  }) {
    // =======================
    // 1. VALIDATE INPUT
    // =======================
    if (!dto?.email || !dto?.password) {
      throw new BadRequestException({
        message: 'email and password are required',
        errorCode: 'VALIDATION_ERROR',
      });
    }

    const email = dto.email.toLowerCase().trim();

    // =======================
    // 2. FIND IDENTITY
    // =======================
    const identity = await this.identityRepo.findByEmail(email);

    if (!identity) {
      throw new IdentityNotFoundException({
        type: AuthMethod.EMAIL,
        value: email,
      });
    }

    identity.ensureActive();
    identity.ensureVerified();

    // =======================
    // 3. GET USER
    // =======================
    const user = await this.userRepo.findById(identity.userId);

    if (!user) {
      throw new UserNotFoundException({
        userId: identity.userId,
      });
    }

    user.ensureActive();

    // =======================
    // 4. ROLE CHECK
    // =======================
    this.authService.ensureAdmin(user);

    // =======================
    // 5. VERIFY PASSWORD
    // =======================
    await this.authService.verifyPassword(identity, dto.password);

    // =======================
    // 6. GENERATE EMAIL OTP & CHALLENGE
    // =======================
    const challengeId = crypto.randomUUID();
    const otpCode = this.authService.generateSecureOtp();
    const otpHash = this.authService.hashOtp(otpCode);
    const ttlSeconds = 300; // 5 minutes
    const otpExpiresAt = Date.now() + ttlSeconds * 1000;

    const challengeData = {
      challengeId,
      userId: user.id,
      identityId: identity.id,
      email: identity.value,
      otpHash,
      otpExpiresAt,
      emailOtpVerified: false,
      attempts: 0,
      resendCount: 0,
      lastSentAt: Date.now(),
      deviceId: dto.deviceId || crypto.randomUUID(),
      deviceName: dto.deviceName,
      platform: dto.platform,
      ip: dto.ip,
      userAgent: dto.userAgent,
    };

    // =======================
    // 7. SEND EMAIL VIA BREVO
    // =======================
    const emailSubject = 'JPL Medwin Admin - Verification Code';
    const emailBody = `Your Admin Panel verification code is ${otpCode}. This code expires in 5 minutes. If you did not attempt to sign in, please secure your account.`;

    try {
      await this.notification.sendEmail(identity.value, emailSubject, emailBody);
    } catch (error) {
      this.logger.error(`Failed to dispatch Admin Email OTP for user ${user.id}`);
      throw new EmailOtpSendFailedException();
    }

    // Persist challenge after successful email delivery
    await this.adminChallengeStore.createChallenge(challengeData, ttlSeconds);

    // =======================
    // 8. SAFE RESPONSE
    // =======================
    return {
      message: 'Verification code sent to your email',
      challengeId,
      target: maskEmail(identity.value),
      expiresIn: ttlSeconds,
      resendCooldown: 60,
      step: 'EMAIL_OTP',
    };
  }
}
