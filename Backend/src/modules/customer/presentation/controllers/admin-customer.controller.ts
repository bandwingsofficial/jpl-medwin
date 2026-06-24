// src/modules/customer/presentation/controllers/admin-customer.controller.ts

import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';

import { RolesGuard } from '@/modules/auth/presentation/guards/role.guard';

import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';

import { UserRole } from '@/domain/enums/user-role.enum';

import { GetCustomerUseCase } from '../../application/use-cases/get-customer.use-case';

import { GetCustomersUseCase } from '../../application/use-cases/get-customers.use-case';

import { DeactivateCustomerUseCase } from '../../application/use-cases/deactivate-customer.use-case';

import { GetCustomerOrdersUseCase } from '../../application/use-cases/get-customer-orders.use-case';
import { GetCustomerAnalyticsUseCase } from '../../application/use-cases/get-customer-analytics.use-case';

@Controller('admin/customers')
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
@Roles(UserRole.ADMIN)
export class AdminCustomerController {
  constructor(
    private readonly getCustomerUseCase: GetCustomerUseCase,

    private readonly getCustomersUseCase: GetCustomersUseCase,

    private readonly deactivateCustomerUseCase: DeactivateCustomerUseCase,

    private readonly getCustomerOrdersUseCase: GetCustomerOrdersUseCase,

    private readonly getCustomerAnalyticsUseCase: GetCustomerAnalyticsUseCase,
  ) {}


// =======================
// 📊 CUSTOMER ANALYTICS
// =======================

@Get('analytics')
async getAnalytics() {
  return this.getCustomerAnalyticsUseCase.execute();
}
  // =======================
  // 📋 GET CUSTOMERS
  // =======================

  @Get()
  async getCustomers(
    @Query('search')
    search?: string,

    @Query('page')
    page?: string,

    @Query('limit')
    limit?: string,
  ) {
    return this.getCustomersUseCase.execute(
      {
        search,

        page: page
          ? Number(page)
          : 1,

        limit: limit
          ? Number(limit)
          : 20,
      },
    );
  }

  // =======================
  // 👤 GET CUSTOMER
  // =======================

  @Get(':id')
  async getCustomer(
    @Param('id') id: string,
  ) {
    return this.getCustomerUseCase.execute(
      {
        userId: id,
      },
    );
  }

  // =======================
  // 📦 GET CUSTOMER ORDERS
  // =======================

  @Get(':id/orders')
  async getCustomerOrders(
    @Param('id') id: string,
  ) {
    return this.getCustomerOrdersUseCase.execute(
      {
        userId: id,
      },
    );
  }

  // =======================
  // 🚫 DEACTIVATE CUSTOMER
  // =======================

  @Patch(':id/deactivate')
  async deactivateCustomer(
    @Param('id') id: string,
  ) {
    await this.deactivateCustomerUseCase.execute(
      {
        userId: id,
      },
    );

    return {
      success: true,

      message:
        'Customer deactivated successfully',
    };
  }

  // =======================
  // 🗑 DELETE CUSTOMER
  // =======================

  @Delete(':id')
  async deleteCustomer(
    @Param('id') id: string,
  ) {
    return {
      success: false,

      message:
        'Delete customer not implemented yet',

      userId: id,
    };
  }


}