import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; // ✅ ADD

import { AuthController } from '@/presentation/controllers/auth.controller';
import { AdminController } from '@/presentation/controllers/admin.controller';

import { JwtAuthGuard } from '@/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@/presentation/guards/role.guard';

// ✅ ADD THIS
import { JwtStrategy } from '@/presentation/strategies/jwt.strategy';

// =======================
// USE CASES
// =======================
import { SendOtpUseCase } from '@/application/use-cases/send-otp.usecase';
import { VerifyOtpUseCase } from '@/application/use-cases/verify-otp.usecase';
import { RefreshTokenUseCase } from '@/application/use-cases/refresh-token.usecase';
import { LogoutUseCase } from '@/application/use-cases/logout.usecase';
import { LogoutAllDevicesUseCase } from '@/application/use-cases/logout-all.usecase';
import { GetActiveSessionsUseCase } from '@/application/use-cases/get-active-sessions.usecase';
import { LogoutDeviceUseCase } from '@/application/use-cases/logout-device.usecase';
import { AdminLoginUseCase } from '@/application/use-cases/admin-login.usecase';

// =======================
// DOMAIN SERVICES
// =======================
import { OtpDomainService } from '@/domain/services/otp.domain.service';
import { RateLimitDomainService } from '@/domain/services/ratelimit.domain.service';
import { SessionDomainService } from '@/domain/services/session.domain.service';
import { AuthDomainService } from '@/domain/services/auth.domain.service';

// =======================
// PORTS
// =======================
import { TOKENS } from '@/common/constants/tokens';

// =======================
// ADAPTERS
// =======================
import { JwtTokenAdapter } from '@/infrastructure/jwt/jwt.service';
import { RedisOtpStore } from '@/infrastructure/redis/otp.redis.repository';
import { PrismaUserRepository } from '@/infrastructure/persistence/prisma/repositories/user.repository';
import { PrismaSessionRepository } from '@/infrastructure/persistence/prisma/repositories/session.repository';
import { PrismaAuthIdentityRepository } from '@/infrastructure/persistence/prisma/repositories/auth-identity.repository';
import { RedisRateLimitStore } from '@/infrastructure/redis/redis-rate-limit.store';
import { ConsoleNotificationAdapter } from '@/infrastructure/notification/notification.adapter';

import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { RedisModule } from '@modules/auth/infrastructure/redis/redis.module';
import { CoinsModule } from '../coins/coins.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    CoinsModule,
    // ✅ REQUIRED FOR PASSPORT
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback-secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],

  controllers: [AuthController, AdminController],

  providers: [
    // =======================
    // ✅ ADD STRATEGY HERE
    // =======================
    JwtStrategy,

    // =======================
    // USE CASES
    // =======================
    SendOtpUseCase,
    VerifyOtpUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    LogoutAllDevicesUseCase,
    GetActiveSessionsUseCase,
    LogoutDeviceUseCase,
    AdminLoginUseCase,

    // =======================
    // DOMAIN SERVICES
    // =======================
    OtpDomainService,
    RateLimitDomainService,
    SessionDomainService,
    AuthDomainService,

    // =======================
    // GUARDS
    // =======================
    JwtAuthGuard,
    RolesGuard,

    // =======================
    // REPOSITORIES
    // =======================
    {
      provide: TOKENS.OTP_STORE,
      useClass: RedisOtpStore,
    },
    {
      provide: TOKENS.USER_REPO,
      useClass: PrismaUserRepository,
    },
    {
      provide: TOKENS.SESSION_REPO,
      useClass: PrismaSessionRepository,
    },
    {
      provide: TOKENS.AUTH_IDENTITY_REPO,
      useClass: PrismaAuthIdentityRepository,
    },
    {
      provide: TOKENS.RATE_LIMIT_STORE,
      useClass: RedisRateLimitStore,
    },

    // =======================
    // PORTS
    // =======================
    {
      provide: TOKENS.TOKEN_PORT,
      useClass: JwtTokenAdapter,
    },
    {
      provide: TOKENS.NOTIFICATION_PORT,
      useClass: ConsoleNotificationAdapter,
    },
  ],

  exports: [JwtAuthGuard, RolesGuard, SessionDomainService, TOKENS.TOKEN_PORT, TOKENS.SESSION_REPO],
})
export class AuthModule {}
