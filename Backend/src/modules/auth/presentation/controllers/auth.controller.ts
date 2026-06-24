import { Body, Controller, Post, Get, Delete, Param, Req, Res, UseGuards } from '@nestjs/common';

import { Response } from 'express';

import { SendOtpUseCase } from '@/application/use-cases/send-otp.usecase';
import { VerifyOtpUseCase } from '@/application/use-cases/verify-otp.usecase';
import { RefreshTokenUseCase } from '@/application/use-cases/refresh-token.usecase';
import { LogoutUseCase } from '@/application/use-cases/logout.usecase';
import { LogoutAllDevicesUseCase } from '@/application/use-cases/logout-all.usecase';
import { GetActiveSessionsUseCase } from '@/application/use-cases/get-active-sessions.usecase';
import { LogoutDeviceUseCase } from '@/application/use-cases/logout-device.usecase';

import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';

import { SendOtpDto } from '@/application/dto/send-otp.dto';
import { VerifyOtpDto } from '@/application/dto/verify-otp.dto';

import { maskEmail, maskPhone } from '@/common/utils/mask.util';
import { CookieHelper } from '@/common/utils/cookie.helper';

// ✅ IMPORT CUSTOM TYPE
import { AuthRequest } from '@/modules/auth/types/auth-request.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly sendOtpUseCase: SendOtpUseCase,
    private readonly verifyOtpUseCase: VerifyOtpUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly logoutAllDevicesUseCase: LogoutAllDevicesUseCase,
    private readonly getActiveSessionsUseCase: GetActiveSessionsUseCase,
    private readonly logoutDeviceUseCase: LogoutDeviceUseCase,
  ) {}

  // =======================
  // 1. Send OTP
  // =======================

  @Post('send-otp')
  async sendOtp(@Body() dto: SendOtpDto) {
    const result = await this.sendOtpUseCase.execute(dto);

    const target =
      result.method === 'email' ? maskEmail(result.identifier) : maskPhone(result.identifier);

    return {
  success: true,
  message: 'OTP sent successfully',
  data: {
    method: result.method,
    target,
    retryAfter: result.retryAfter,
    remainingSendAttempts: result.remainingSendAttempts,
  },
};
  }

  // =======================
  // 2. Verify OTP (LOGIN)
  // =======================

  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.verifyOtpUseCase.execute(dto);

    CookieHelper.setAuthCookies(res, {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
    console.log('ACCESS TOKEN:', result.accessToken);

    return {
  success: true,
  message: 'Login successful',
  data: {
    user: result.user,
    session: {
      id: result.session.id,
      deviceId: result.session.deviceId,
      deviceName: result.session.deviceName,
      platform: result.session.platform,
    },
  },
};
  }

  // =======================
  // 3. Refresh
  // =======================

  @Post('refresh')
  async refresh(
    @Req() req: AuthRequest, // ✅ FIXED TYPE
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken;

    const result = await this.refreshTokenUseCase.execute(refreshToken);

    CookieHelper.setAuthCookies(res, {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

    return {
      message: 'Token refreshed successfully',
    };
  }

  // =======================
  // 🔐 PROTECTED ROUTES
  // =======================

  @UseGuards(JwtAuthGuard)
@Get('me')
async me(@Req() req: AuthRequest) {
  const user = req.user;

  return {
    success: true,
    message: 'User fetched successfully',
    data: {
      user: {
        id: user.userId,
        role: user.role,
      },
    },
  };
}

  // =======================
  // 🚪 LOGOUT
  // =======================

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: AuthRequest, @Res({ passthrough: true }) res: Response) {
    const result = await this.logoutUseCase.execute(req.user);

    CookieHelper.clearAuthCookies(res);

    return {
      message: result.message,
    };
  }

  // =======================
  // 🚪 LOGOUT ALL
  // =======================

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  async logoutAll(@Req() req: AuthRequest, @Res({ passthrough: true }) res: Response) {
    const result = await this.logoutAllDevicesUseCase.execute(req.user);

    CookieHelper.clearAuthCookies(res);

    return {
      message: result.message,
    };
  }

  // =======================
  // 📱 SESSIONS
  // =======================

  @UseGuards(JwtAuthGuard)
  @Get('sessions')
  async getSessions(@Req() req: AuthRequest) {
    const sessions = await this.getActiveSessionsUseCase.execute(req.user);

    return {
      message: 'Sessions fetched successfully',
      sessions,
    };
  }

  // =======================
  // ❌ LOGOUT DEVICE
  // =======================

  @UseGuards(JwtAuthGuard)
  @Delete('sessions/:sessionId')
  async logoutDevice(@Req() req: AuthRequest, @Param('sessionId') sessionId: string) {
    const result = await this.logoutDeviceUseCase.execute(req.user, sessionId);

    return {
      message: result.message,
    };
  }
}


