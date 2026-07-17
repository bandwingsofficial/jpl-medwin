import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

import { AuthIdentityRepository } from '@/domain/repositories/auth-identity.repository';
import { UserRepository } from '@/domain/repositories/user.repository';
import { SessionRepository } from '@/domain/repositories/session.repository';

import { AuthDomainService } from '@/domain/services/auth.domain.service';
import { SessionDomainService } from '@/domain/services/session.domain.service';

import { TokenPort } from '@/application/ports/token.port';

import { TOKENS } from '@/common/constants/tokens';

import { AuthMethod } from '@/domain/enums/auth-method.enum';
import { SessionType } from '@/domain/enums/session-type.enum';

import { IdentityNotFoundException } from '@/domain/exceptions/auth/identity-not-found.exception';
import { UserNotFoundException } from '@/domain/exceptions/user/user-not-found.exception';

import { Session } from '@/domain/entities/session.entity';

@Injectable()
export class AdminLoginUseCase {
  constructor(
    @Inject(TOKENS.AUTH_IDENTITY_REPO)
    private readonly identityRepo: AuthIdentityRepository,

    @Inject(TOKENS.USER_REPO)
    private readonly userRepo: UserRepository,

    @Inject(TOKENS.SESSION_REPO)
    private readonly sessionRepo: SessionRepository,

    @Inject(TOKENS.TOKEN_PORT)
    private readonly tokenPort: TokenPort,

    private readonly authService: AuthDomainService,
    private readonly sessionService: SessionDomainService,
  ) {}

  async execute(dto: {
    email: string;
    password: string;
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
    if (!dto?.email || !dto?.password || !dto?.totpCode) {
      throw new BadRequestException({
        message: 'email, password and totpCode are required',
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
    // 6. VERIFY TOTP
    // =======================
    this.authService.verifyTotp(identity, dto.totpCode);

    // =======================
    // 7. DELETE OLD SESSION
    // =======================
    await this.sessionRepo.deleteByUserIdAndDeviceId(user.id, dto.deviceId);

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
        dto.deviceId,
        hashed,
        this.getExpiryDate(),
        false,
        undefined,
        undefined,
        dto.deviceName,
        dto.platform,
        SessionType.ADMIN,
        dto.ip,
        dto.userAgent,
      ),
    );

    // =======================
    // 9. ACCESS TOKEN
    // =======================
    const accessToken = await this.tokenPort.generateAccessToken({
      userId: user.id,
      sessionId: session.id,
      tokenVersion: user.tokenVersion,
      role: user.role,
    });

    // =======================
    // 10. RETURN (SAFE RESPONSE)
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
