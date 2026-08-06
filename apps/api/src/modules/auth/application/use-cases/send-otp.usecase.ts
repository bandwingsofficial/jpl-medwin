import { Injectable, Inject } from '@nestjs/common';
import { SendOtpDto } from '@/application/dto/send-otp.dto';
import { OtpPurpose } from '@/domain/enums/otp-purpose.enum';

import { IdentifierRequiredException } from '@/domain/exceptions/validation/identifier-required.exception';

import { OtpDomainService } from '@/domain/services/otp.domain.service';
import { RateLimitDomainService } from '@/domain/services/ratelimit.domain.service';

import { NotificationPort } from '@/application/ports/notification.port';

import { PhoneNumberVO } from '@/domain/value-objects/phone-number.vo';
import { EmailVO } from '@/domain/value-objects/email.vo';

import { TOKENS } from '@/common/constants/tokens';
import { OTP_POLICY } from '@/domain/policies/otp.policy';
import { RATELIMIT_POLICY } from '@/domain/policies/ratelimit.policy';

import { OtpStorePort } from '@/application/ports/otp-store.port';
import { RateLimitStorePort } from '@/application/ports/rate-limit-store.port';

@Injectable()
export class SendOtpUseCase {
  constructor(
    private readonly otpService: OtpDomainService,
    private readonly rateLimitService: RateLimitDomainService,

    @Inject(TOKENS.OTP_STORE)
    private readonly otpStore: OtpStorePort,

    @Inject(TOKENS.RATE_LIMIT_STORE)
    private readonly rateLimitStore: RateLimitStorePort,

    @Inject(TOKENS.NOTIFICATION_PORT)
    private readonly notification: NotificationPort,
  ) {}

  async execute(dto: SendOtpDto) {
    // =======================
    // 0. PURPOSE
    // =======================
    const purpose = dto.purpose ?? OtpPurpose.LOGIN;

    const { identifier, isPhone } = this.resolveIdentifier(dto);

    // 🔥 CRITICAL: separate key for SEND OTP
    const rateLimitKey = `otp:send:${identifier}`;

    // =======================
    // 1. CHECK BLOCK
    // =======================
    const blockTtl = await this.rateLimitStore.getBlockTtl(rateLimitKey);

    this.rateLimitService.ensureNotBlocked({
      identifier,
      purpose,
      blockTtl,
    });

    // =======================
    // 2. GET SEND ATTEMPTS
    // =======================
    const sendAttempts = await this.rateLimitStore.getAttempts(rateLimitKey);

    this.rateLimitService.checkAttempts({
      identifier,
      purpose,
      actionAttempts: sendAttempts,
    });

    // =======================
    // 3. CHECK COOLDOWN
    // =======================
    const cooldownTtl = await this.otpStore.getCooldownTtl(identifier);

    this.otpService.checkCooldown({
      identifier,
      purpose,
      retryAfter: cooldownTtl,
      remainingSendAttempts: this.getRemainingSendAttempts(sendAttempts),
    });

    // =======================
    // 4. GENERATE OTP
    // =======================
    const code = this.otpService.generateCode();

    // =======================
    // 5. SAVE OTP
    // =======================
    await this.otpStore.save({
      identifier,
      code,
      expiresIn: OTP_POLICY.EXPIRY_SECONDS,
    });

    // =======================
    // 6. INCREMENT SEND ATTEMPTS
    // =======================
    const newSendAttempts = await this.rateLimitStore.increment(rateLimitKey);

    // =======================
    // 7. BLOCK IF NEEDED
    // =======================
    if (this.rateLimitService.shouldBlock(newSendAttempts)) {
      await this.rateLimitStore.block(rateLimitKey);

      const updatedBlockTtl = await this.rateLimitStore.getBlockTtl(rateLimitKey);

      this.rateLimitService.ensureNotBlocked({
        identifier,
        purpose,
        blockTtl: updatedBlockTtl,
      });
    }

    // =======================
    // 8. SEND OTP
    // =======================
    const message = this.buildMessage(code, purpose);

    if (isPhone) {
      await this.notification.sendSms(identifier, message);
    } else {
      await this.notification.sendEmail(identifier, 'Your OTP Code', message);
    }

    // =======================
    // 9. RESPONSE
    // =======================
    return {
      method: isPhone ? 'phone' : 'email',
      identifier,
      retryAfter: OTP_POLICY.RESEND_COOLDOWN_SECONDS,
      remainingSendAttempts: this.getRemainingSendAttempts(newSendAttempts),
    };
  }

  // =======================
  // HELPERS
  // =======================

  private resolveIdentifier(dto: SendOtpDto): {
    identifier: string;
    isPhone: boolean;
  } {
    if (!dto.phone && !dto.email) {
      throw new IdentifierRequiredException();
    }

    if (dto.phone) {
      const phone = new PhoneNumberVO(dto.phone);
      return { identifier: phone.getValue(), isPhone: true };
    }

    const email = new EmailVO(dto.email!);
    return { identifier: email.getValue(), isPhone: false };
  }

  private getRemainingSendAttempts(attempts: number): number {
    return Math.max(0, RATELIMIT_POLICY.MAX_ATTEMPTS - attempts);
  }

  private buildMessage(code: string, purpose: OtpPurpose): string {
    return `Your OTP for ${purpose.toLowerCase()} is ${code}`;
  }
}
