import { Body, Controller, Post, Get, UseGuards, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/presentation/guards/role.guard';
import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';

import { AdminLoginDto } from '@/application/dto/admin-login.dto';
import {
  AdminVerifyEmailOtpDto,
  AdminResendEmailOtpDto,
  AdminVerifyTotpDto,
} from '@/application/dto/admin-email-otp.dto';
import { UserRole } from '@/domain/enums/user-role.enum';
import { CookieHelper } from '@/common/utils/cookie.helper';

import { AdminLoginUseCase } from '@/application/use-cases/admin-login.usecase';
import { VerifyAdminEmailOtpUseCase } from '@/application/use-cases/verify-admin-email-otp.usecase';
import { ResendAdminEmailOtpUseCase } from '@/application/use-cases/resend-admin-email-otp.usecase';
import { VerifyAdminTotpUseCase } from '@/application/use-cases/verify-admin-totp.usecase';
import { AuthRequest } from '@/modules/auth/types/auth-request.type';

@Controller('auth/admin')
export class AdminController {
  constructor(
    private readonly adminLoginUseCase: AdminLoginUseCase,
    private readonly verifyAdminEmailOtpUseCase: VerifyAdminEmailOtpUseCase,
    private readonly resendAdminEmailOtpUseCase: ResendAdminEmailOtpUseCase,
    private readonly verifyAdminTotpUseCase: VerifyAdminTotpUseCase,
  ) {}

  // =======================
  // 🔐 1. ADMIN LOGIN (CREDENTIALS + SEND EMAIL OTP)
  // =======================

  @Post('login')
  async login(@Body() dto: AdminLoginDto) {
    const result = await this.adminLoginUseCase.execute(dto);

    return {
      message: result.message,
      challengeId: result.challengeId,
      target: result.target,
      expiresIn: result.expiresIn,
      resendCooldown: result.resendCooldown,
      step: result.step,
    };
  }

  // =======================
  // 📧 2. VERIFY EMAIL OTP
  // =======================

  @Post('verify-email-otp')
  async verifyEmailOtp(@Body() dto: AdminVerifyEmailOtpDto) {
    const result = await this.verifyAdminEmailOtpUseCase.execute(dto);

    return {
      message: result.message,
      challengeId: result.challengeId,
      emailOtpVerified: result.emailOtpVerified,
      step: result.step,
    };
  }

  // =======================
  // 🔄 3. RESEND EMAIL OTP
  // =======================

  @Post('resend-email-otp')
  async resendEmailOtp(@Body() dto: AdminResendEmailOtpDto) {
    const result = await this.resendAdminEmailOtpUseCase.execute(dto);

    return {
      message: result.message,
      challengeId: result.challengeId,
      expiresIn: result.expiresIn,
      resendCooldown: result.resendCooldown,
    };
  }

  // =======================
  // 🔐 4. VERIFY TOTP & FINALIZE LOGIN
  // =======================

  @Post('verify-totp')
  async verifyTotp(
    @Body() dto: AdminVerifyTotpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.verifyAdminTotpUseCase.execute(dto);

    // 🍪 set cookies on final successful authentication
    CookieHelper.setAuthCookies(res, {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

    return {
      message: 'Admin login successful',
      user: result.user,
      session: result.session,
    };
  }

  // =======================
  // 👤 CURRENT ADMIN
  // =======================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('me')
  async me(@Req() req: AuthRequest) {
    const user = req.user;

    return {
      user: {
        id: user.userId,
        role: user.role,
      },
    };
  }

  // =======================
  // 🔒 PROTECTED ROUTE
  // =======================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('dashboard')
  async dashboard(@Req() req: Request) {
    return {
      message: 'Welcome Admin 🚀',
      user: req['user'],
    };
  }

  // =======================
  // 🚪 LOGOUT
  // =======================

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    CookieHelper.clearAuthCookies(res);

    return { message: 'Logged out successfully' };
  }
}
