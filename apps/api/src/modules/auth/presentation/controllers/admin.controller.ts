import { Body, Controller, Post, Get, UseGuards, Req, Res } from '@nestjs/common';

import { Request, Response } from 'express'; // ✅ FIXED

import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/presentation/guards/role.guard';
import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';

import { AdminLoginDto } from '@/application/dto/admin-login.dto';
import { UserRole } from '@/domain/enums/user-role.enum';
import { CookieHelper } from '@/common/utils/cookie.helper';

import { AdminLoginUseCase } from '@/application/use-cases/admin-login.usecase';
import { AuthRequest } from '@/modules/auth/types/auth-request.type';

@Controller('auth/admin')
export class AdminController {
  constructor(private readonly adminLoginUseCase: AdminLoginUseCase) {}

  // =======================
  // 🔐 ADMIN LOGIN
  // =======================

  @Post('login')
  async login(
    @Body() dto: AdminLoginDto,
    @Res({ passthrough: true }) res: Response, // ✅ now properly typed
  ) {
    const result = await this.adminLoginUseCase.execute(dto);

    // 🍪 set cookies
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
