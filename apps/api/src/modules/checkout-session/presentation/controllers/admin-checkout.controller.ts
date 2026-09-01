// src/modules/checkout-session/presentation/controllers/admin-checkout.controller.ts

import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/presentation/guards/role.guard';
import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';
import { UserRole } from '@/domain/enums/user-role.enum';

import { GetAdminAbandonedCheckoutsUseCase } from '../../application/use-cases/get-admin-abandoned-checkouts.use-case';
import { GetAdminAbandonedCheckoutByIdUseCase } from '../../application/use-cases/get-admin-abandoned-checkout-by-id.use-case';

@Controller('admin/checkouts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminCheckoutController {
  constructor(
    private readonly getAdminAbandonedCheckoutsUseCase: GetAdminAbandonedCheckoutsUseCase,
    private readonly getAdminAbandonedCheckoutByIdUseCase: GetAdminAbandonedCheckoutByIdUseCase,
  ) {}

  // =========================================
  // 📋 GET ABANDONED CHECKOUTS (LIST)
  // =========================================
  @Get()
  async getCheckouts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    const data = await this.getAdminAbandonedCheckoutsUseCase.execute({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search,
      status,
      from,
      to,
      sortBy,
      sortOrder,
    });

    return {
      message: 'Abandoned checkouts fetched successfully',
      ...data,
    };
  }

  // =========================================
  // 🔍 GET ABANDONED CHECKOUT DETAILS
  // =========================================
  @Get(':id')
  async getCheckoutById(@Param('id') id: string) {
    const data = await this.getAdminAbandonedCheckoutByIdUseCase.execute({
      checkoutSessionId: id,
    });

    return {
      message: 'Abandoned checkout details fetched successfully',
      data,
    };
  }
}
