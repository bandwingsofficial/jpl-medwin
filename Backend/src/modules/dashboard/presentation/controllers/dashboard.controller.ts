import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';

import { RolesGuard } from '@/modules/auth/presentation/guards/role.guard';

import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';

import { UserRole } from '@/domain/enums/user-role.enum';

import { DashboardFilterDto } from '../dto/dashboard-filter.dto';

import { GetOrderDashboardUseCase } from '../../application/use-cases/get-order-dashboard.use-case';

import { GetOrderStatusDashboardUseCase } from '../../application/use-cases/get-order-status-dashboard.use-case';

import { GetRevenueDashboardUseCase } from '../../application/use-cases/get-revenue-dashboard.use-case';

import { GetRecentOrderDashboardUseCase } from '../../application/use-cases/get-recent-order-dashboard.use-case';

import { GetTopProductDashboardUseCase } from '../../application/use-cases/get-top-product-dashboard.use-case';

import { GetTopCustomerDashboardUseCase } from '../../application/use-cases/get-top-customer-dashboard.use-case';

import { GetCustomerDashboardUseCase } from '../../application/use-cases/get-customer-dashboard.use-case';

import { GetDashboardOverviewUseCase } from '../../application/use-cases/get-dashboard-overview.use-case';
import { GetLastFiveMonthsDashboardUseCase } from '../../application/use-cases/get-last-five-months-dashboard.use-case';

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class DashboardController {
  constructor(
    private readonly getOrderDashboardUseCase: GetOrderDashboardUseCase,

    private readonly getOrderStatusDashboardUseCase: GetOrderStatusDashboardUseCase,

    private readonly getRevenueDashboardUseCase: GetRevenueDashboardUseCase,

    private readonly getRecentOrderDashboardUseCase: GetRecentOrderDashboardUseCase,

    private readonly getTopProductDashboardUseCase: GetTopProductDashboardUseCase,

    private readonly getTopCustomerDashboardUseCase: GetTopCustomerDashboardUseCase,
    private readonly getCustomerDashboardUseCase: GetCustomerDashboardUseCase,
    private readonly getDashboardOverviewUseCase: GetDashboardOverviewUseCase,
    private readonly getLastFiveMonthsDashboardUseCase: GetLastFiveMonthsDashboardUseCase,
  ) {}

  // =======================
  // 📊 ORDERS
  // =======================

  @Get('orders')
  async getOrders(
    @Query()
    query: DashboardFilterDto,
  ) {
    const data = await this.getOrderDashboardUseCase.execute(query);

    return {
      message: 'Order dashboard fetched successfully',

      ...data,
    };
  }

  // =======================
  // 📦 ORDER STATUS
  // =======================

  @Get('order-status')
  async getOrderStatus(
    @Query()
    query: DashboardFilterDto,
  ) {
    const data = await this.getOrderStatusDashboardUseCase.execute(query);

    return {
      message: 'Order status dashboard fetched successfully',

      ...data,
    };
  }

  // =======================
  // 💰 REVENUE
  // =======================

  @Get('revenue')
  async getRevenue(
    @Query()
    query: DashboardFilterDto,
  ) {
    const data = await this.getRevenueDashboardUseCase.execute(query);

    return {
      message: 'Revenue dashboard fetched successfully',

      ...data,
    };
  }

  // =======================
  // 🕒 RECENT ORDERS
  // =======================

  @Get('recent-orders')
  async getRecentOrders(
    @Query()
    query: DashboardFilterDto,
  ) {
    const data = await this.getRecentOrderDashboardUseCase.execute(query);

    return {
      message: 'Recent orders fetched successfully',

      ...data,
    };
  }

  // =======================
  // 🏆 TOP PRODUCTS
  // =======================

  @Get('top-products')
  async getTopProducts(
    @Query()
    query: DashboardFilterDto,
  ) {
    const data = await this.getTopProductDashboardUseCase.execute(query);

    return {
      message: 'Top products fetched successfully',

      ...data,
    };
  }

  // =======================
  // 🏆 TOP CUSTOMERS
  // =======================

  @Get('top-customers')
  async getTopCustomers(
    @Query()
    query: DashboardFilterDto,
  ) {
    const data = await this.getTopCustomerDashboardUseCase.execute(query);

    return {
      message: 'Top customers fetched successfully',

      ...data,
    };
  }

  // =======================
  // 👥 CUSTOMER METRICS
  // =======================

  @Get('customers')
  async getCustomers(
    @Query()
    query: DashboardFilterDto,
  ) {
    const data = await this.getCustomerDashboardUseCase.execute(query);

    return {
      message: 'Customer dashboard fetched successfully',

      ...data,
    };
  }

  // =======================
  // 📊 DASHBOARD OVERVIEW
  // =======================

  @Get()
  async getDashboard(
    @Query()
    query: DashboardFilterDto,
  ) {
    const data = await this.getDashboardOverviewUseCase.execute(query);

    return {
      message: 'Dashboard fetched successfully',

      ...data,
    };
  }
  // =======================
  // 📅 LAST 5 MONTHS DASHBOARD
  // =======================

  @Get('last-five-months')
  async getLastFiveMonthsDashboard() {
    const data = await this.getLastFiveMonthsDashboardUseCase.execute();

    return {
      message: 'Last five months dashboard fetched successfully',

      ...data,
    };
  }
}
