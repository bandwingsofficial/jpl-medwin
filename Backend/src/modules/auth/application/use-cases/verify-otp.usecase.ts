import { Injectable, Inject } from '@nestjs/common';

import { VerifyOtpDto } from '@/application/dto/verify-otp.dto';
import { CoinWallet } from '@/modules/coins/domain/entities/coin-wallet.entity';
import { CoinWalletRepository } from '@/modules/coins/domain/repositories/coin-wallet.repository';

import { IdentifierRequiredException } from '@/domain/exceptions/validation/identifier-required.exception';
import { InvalidOtpException } from '@/domain/exceptions/otp/invalid-otp.exception';
import { UserNotFoundException } from '@/domain/exceptions/user/user-not-found.exception';
import { ValidationException } from '@/domain/exceptions/validation/identifier-required.exception';

import { OtpDomainService } from '@/domain/services/otp.domain.service';
import { RateLimitDomainService } from '@/domain/services/ratelimit.domain.service';

import { UserRepository } from '@/domain/repositories/user.repository';
import { SessionRepository } from '@/domain/repositories/session.repository';
import { AuthIdentityRepository } from '@/domain/repositories/auth-identity.repository';

import { TokenPort } from '@/application/ports/token.port';
import { OtpStorePort } from '@/application/ports/otp-store.port';
import { RateLimitStorePort } from '@/application/ports/rate-limit-store.port';

import { PhoneNumberVO } from '@/domain/value-objects/phone-number.vo';
import { EmailVO } from '@/domain/value-objects/email.vo';
import { OtpCodeVO } from '@/domain/value-objects/otp-code.vo';

import { User } from '@/domain/entities/user.entity';
import { Session } from '@/domain/entities/session.entity';
import { AuthIdentity } from '@/domain/entities/auth-identity.entity';

import { AuthMethod } from '@/domain/enums/auth-method.enum';
import { Platform } from '@/domain/enums/platform.enum';
import { OtpPurpose } from '@/domain/enums/otp-purpose.enum';

import { TOKENS } from '@/common/constants/tokens';
import { RATELIMIT_POLICY } from '@/domain/policies/ratelimit.policy';

import * as crypto from 'crypto';
import { SessionType } from '../../domain/enums/session-type.enum';

@Injectable()
export class VerifyOtpUseCase {
  constructor(
    private readonly otpService: OtpDomainService,
    private readonly rateLimitService: RateLimitDomainService,

    @Inject(TOKENS.OTP_STORE)
    private readonly otpStore: OtpStorePort,

    @Inject(TOKENS.RATE_LIMIT_STORE)
    private readonly rateLimitStore: RateLimitStorePort,

    @Inject(TOKENS.USER_REPO)
    private readonly userRepo: UserRepository,

    @Inject(TOKENS.AUTH_IDENTITY_REPO)
    private readonly identityRepo: AuthIdentityRepository,

    @Inject(TOKENS.SESSION_REPO)
    private readonly sessionRepo: SessionRepository,

    @Inject(TOKENS.TOKEN_PORT)
    private readonly tokenPort: TokenPort,

    @Inject(TOKENS.COIN_WALLET_REPO)
private readonly walletRepo: CoinWalletRepository,
  ) {}

  async execute(dto: VerifyOtpDto) {
    const errors: Record<string, string> = {};

    if (!dto.code) errors.code = 'code is required';
    if (!dto.deviceId) errors.deviceId = 'deviceId is required';
    if (!dto.phone && !dto.email) {
      errors.identifier = 'phone or email is required';
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationException(errors);
    }

    const { identifier, isPhone } = this.resolveIdentifier(dto);

    // 🔥 CRITICAL: separate key for VERIFY OTP
    const rateLimitKey = `otp:verify:${identifier}`;

    // =======================
    // 1. CHECK BLOCK
    // =======================
    const blockTtl = await this.rateLimitStore.getBlockTtl(rateLimitKey);

    this.rateLimitService.ensureNotBlocked({
      identifier,
      purpose: OtpPurpose.LOGIN,
      blockTtl,
    });

    // =======================
    // 2. GET OTP
    // =======================
    const otpData = await this.otpStore.get(identifier);

    if (!otpData) {
      const attempts = await this.rateLimitStore.increment(rateLimitKey);

      if (this.rateLimitService.shouldBlock(attempts)) {
        await this.rateLimitStore.block(rateLimitKey);

        const ttl = await this.rateLimitStore.getBlockTtl(rateLimitKey);

        this.rateLimitService.ensureNotBlocked({
          identifier,
          purpose: OtpPurpose.LOGIN,
          blockTtl: ttl,
        });
      }

      throw new InvalidOtpException({
        identifier,
        purpose: OtpPurpose.LOGIN,
        channel: isPhone ? 'PHONE' : 'EMAIL',
        remainingVerifyAttempts: Math.max(0, RATELIMIT_POLICY.MAX_ATTEMPTS - attempts),
      });
    }

    // =======================
    // 3. VALIDATE FORMAT
    // =======================
    const code = new OtpCodeVO(dto.code);

    // =======================
    // 4. INCREMENT VERIFY ATTEMPTS
    // =======================
    const verifyAttempts = await this.otpStore.incrementAttempts(identifier);

    try {
      this.otpService.validateOtp({
        storedCode: otpData.code,
        inputCode: code.getValue(),
        verifyAttempts,
        expiresAt: otpData.expiresAt,
        identifier,
        purpose: OtpPurpose.LOGIN,
      });
    } catch (err) {
      // also increment rate limit for brute-force protection
      const attempts = await this.rateLimitStore.increment(rateLimitKey);

      if (this.rateLimitService.shouldBlock(attempts)) {
        await this.rateLimitStore.block(rateLimitKey);

        const ttl = await this.rateLimitStore.getBlockTtl(rateLimitKey);

        this.rateLimitService.ensureNotBlocked({
          identifier,
          purpose: OtpPurpose.LOGIN,
          blockTtl: ttl,
        });
      }

      throw err;
    }

    // =======================
    // 5. SUCCESS CLEANUP
    // =======================
    await this.otpStore.delete(identifier);

    // reset verify attempts
    await this.rateLimitStore.reset(rateLimitKey);

    // ✅ reset send attempts ALSO
    const sendRateLimitKey = `otp:send:${identifier}`;
    await this.rateLimitStore.reset(sendRateLimitKey);

// =======================
// 6. USER + IDENTITY
// =======================

const method =
  isPhone
    ? AuthMethod.PHONE
    : AuthMethod.EMAIL;

let identity =
  await this.identityRepo.findActiveByTypeAndValue(
    method,
    identifier,
  );

let user: User;

if (!identity) {
  // =======================
  // 👤 CREATE USER
  // =======================

  user =
    await this.userRepo.create(
      new User(
        crypto.randomUUID(),
      ),
    );

  // =======================
  // 👛 CREATE WALLET
  // =======================

  const wallet =
    new CoinWallet(
      crypto.randomUUID(),

      user.id,

      0, // balance

      0, // lifetimeEarned

      0, // lifetimeRedeemed

      0, // lifetimeExpired

      0, // lifetimeRefunded
    );

  await this.walletRepo.create(
    wallet,
  );

  // =======================
  // 🔐 CREATE IDENTITY
  // =======================

  identity =
    await this.identityRepo.create(
      new AuthIdentity(
        crypto.randomUUID(),

        user.id,

        method,

        identifier,

        true,
      ),
    );
} else {
  const existingUser =
    await this.userRepo.findById(
      identity.userId,
    );

  if (!existingUser) {
    throw new UserNotFoundException({
      userId:
        identity.userId,
    });
  }

  user = existingUser;

  if (!identity.isVerified) {
    identity.verify();

    await this.identityRepo.update(
      identity,
    );
  }
}

user.ensureActive();

    // =======================
    // 7. SESSION
    // =======================
    await this.sessionRepo.deleteByUserIdAndDeviceId(user.id, dto.deviceId);

    const sessionId = crypto.randomUUID();

    const refreshToken = await this.tokenPort.generateRefreshToken({
      userId: user.id,
      sessionId,
      tokenVersion: user.tokenVersion,
    });

    const hashedToken = this.hash(refreshToken);

    const session = new Session(
      sessionId,
      user.id,
      dto.deviceId,
      hashedToken,
      this.getExpiryDate(),
      false,
      undefined,
      undefined,
      dto.deviceName,
      this.mapPlatform(dto.platform),
      SessionType.USER,
      dto.ip,
      dto.userAgent,
    );

    const saved = await this.sessionRepo.create(session);

    const accessToken = await this.tokenPort.generateAccessToken({
      userId: user.id,
      sessionId: saved.id,
      tokenVersion: user.tokenVersion,
      role: user.role,
    });

    // =======================
    // 8. RETURN
    // =======================
    return {
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        profilePic: user.profilePic,
      },
      session: saved,
      accessToken,
      refreshToken,
    };
  }

  // =======================
  // HELPERS
  // =======================

  private resolveIdentifier(dto: VerifyOtpDto) {
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

  private mapPlatform(platform?: string): Platform | undefined {
    if (!platform) return undefined;

    switch (platform) {
      case 'WEB':
        return Platform.WEB;
      case 'ANDROID':
        return Platform.ANDROID;
      case 'IOS':
        return Platform.IOS;
      default:
        return undefined;
    }
  }

  private getExpiryDate(): Date {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  private hash(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
  }
}
