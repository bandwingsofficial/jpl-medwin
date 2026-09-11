import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

import { AuthIdentityRepository } from '@/domain/repositories/auth-identity.repository';
import { UserRepository } from '@/domain/repositories/user.repository';
import { SessionRepository } from '@/domain/repositories/session.repository';
import { AuthDomainService } from '@/domain/services/auth.domain.service';
import { AdminChallengeStore } from '@/infrastructure/redis/admin-challenge.store';
import { TokenPort } from '@/application/ports/token.port';

import { TOKENS } from '@/common/constants/tokens';
import { SessionType } from '@/domain/enums/session-type.enum';
import { Session } from '@/domain/entities/session.entity';

import { ChallengeExpiredException } from '@/domain/exceptions/admin/challenge-expired.exception';
import { EmailOtpRequiredException } from '@/domain/exceptions/admin/email-otp-required.exception';
import { IdentityNotFoundException } from '@/domain/exceptions/auth/identity-not-found.exception';
import { UserNotFoundException } from '@/domain/exceptions/user/user-not-found.exception';

@Injectable()
export class VerifyAdminTotpUseCase {
  constructor(
    @Inject(TOKENS.AUTH_IDENTITY_REPO)
    private readonly identityRepo: AuthIdentityRepository,

    @Inject(TOKENS.USER_REPO)
    private readonly userRepo: UserRepository,

    @Inject(TOKENS.SESSION_REPO)
    private readonly sessionRepo: SessionRepository,

    @Inject(TOKENS.TOKEN_PORT)
    private readonly tokenPort: TokenPort,

    private readonly adminChallengeStore: AdminChallengeStore,
    private readonly authService: AuthDomainService,
  ) {}

  async execute(dto: {
    challengeId: string;
    totpCode: string;
    deviceId: string;
    deviceName?: string;
    platform?: any;
    ip?: string;
    userAgent?: string;
  }) {
    // =======================
    // 1. VALIDATE INPUT
    // =======================
    if (!dto?.challengeId || !dto?.totpCode) {
      throw new BadRequestException({
        message: 'challengeId and totpCode are required',
        errorCode: 'VALIDATION_ERROR',
      });
    }

    // =======================
    // 2. RETRIEVE CHALLENGE
    // =======================
    const challenge = await this.adminChallengeStore.getChallenge(dto.challengeId);

    if (!challenge) {
      throw new ChallengeExpiredException();
    }

    // =======================
    // 3. ENFORCE EMAIL OTP VERIFIED
    // =======================
    if (!challenge.emailOtpVerified) {
      throw new EmailOtpRequiredException();
    }

    // =======================
    // 4. GET IDENTITY & USER
    // =======================
    const identity = await this.identityRepo.findById(challenge.identityId);

    if (!identity) {
      throw new IdentityNotFoundException();
    }

    identity.ensureActive();
    identity.ensureVerified();

    const user = await this.userRepo.findById(identity.userId);

    if (!user) {
      throw new UserNotFoundException({ userId: identity.userId });
    }

    user.ensureActive();
    this.authService.ensureAdmin(user);

    // =======================
    // 5. VERIFY TOTP
    // =======================
    this.authService.verifyTotp(identity, dto.totpCode);

    // =======================
    // 6. DELETE CHALLENGE (SINGLE USE)
    // =======================
    await this.adminChallengeStore.deleteChallenge(dto.challengeId);

    // =======================
    // 7. DELETE OLD SESSION FOR DEVICE
    // =======================
    const deviceId = dto.deviceId || challenge.deviceId;
    await this.sessionRepo.deleteByUserIdAndDeviceId(user.id, deviceId);

    // =======================
    // 8. CREATE SESSION
    // =======================
    const sessionId = crypto.randomUUID();

    const refreshToken = await this.tokenPort.generateRefreshToken({
      userId: user.id,
      sessionId,
      tokenVersion: user.tokenVersion,
    });

    const hashed = this.hash(refreshToken);

    const session = await this.sessionRepo.create(
      new Session(
        sessionId,
        user.id,
        deviceId,
        hashed,
        this.getExpiryDate(),
        false,
        undefined,
        undefined,
        dto.deviceName || challenge.deviceName,
        dto.platform || challenge.platform,
        SessionType.ADMIN,
        dto.ip || challenge.ip,
        dto.userAgent || challenge.userAgent,
      ),
    );

    // =======================
    // 9. GENERATE ACCESS TOKEN
    // =======================
    const accessToken = await this.tokenPort.generateAccessToken({
      userId: user.id,
      sessionId: session.id,
      tokenVersion: user.tokenVersion,
      role: user.role,
    });

    // =======================
    // 10. RETURN
    // =======================
    return {
      user: {
        id: user.id,
        role: user.role,
      },
      session: {
        id: session.id,
        deviceId: session.deviceId,
        deviceName: session.deviceName,
        platform: session.platform,
      },
      accessToken,
      refreshToken,
    };
  }

  private hash(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  private getExpiryDate(): Date {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  }
}
