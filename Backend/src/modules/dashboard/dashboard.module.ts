// src/modules/dashboard/dashboard.module.ts

import { Module } from '@nestjs/common';

import { DashboardController } from './presentation/controllers/dashboard.controller';

// =======================
// USE CASES
// =======================

import { GetOrderDashboardUseCase } from './application/use-cases/get-order-dashboard.use-case';

import { GetOrderStatusDashboardUseCase } from './application/use-cases/get-order-status-dashboard.use-case';

import { GetRevenueDashboardUseCase } from './application/use-cases/get-revenue-dashboard.use-case';

import { GetRecentOrderDashboardUseCase } from './application/use-cases/get-recent-order-dashboard.use-case';

import { GetTopProductDashboardUseCase } from './application/use-cases/get-top-product-dashboard.use-case';

import { GetTopCustomerDashboardUseCase } from './application/use-cases/get-top-customer-dashboard.use-case';

import { GetCustomerDashboardUseCase } from './application/use-cases/get-customer-dashboard.use-case';

import { GetDashboardOverviewUseCase } from './application/use-cases/get-dashboard-overview.use-case';

import { GetLastFiveMonthsDashboardUseCase } from './application/use-cases/get-last-five-months-dashboard.use-case';

// =======================
// SERVICES
// =======================

import { OrderDashboardService } from './application/services/order-dashboard.service';

import { OrderStatusDashboardService } from './application/services/order-status-dashboard.service';

import { RevenueDashboardService } from './application/services/revenue-dashboard.service';

import { RecentOrderDashboardService } from './application/services/recent-order-dashboard.service';

import { TopProductDashboardService } from './application/services/top-product-dashboard.service';

import { TopCustomerDashboardService } from './application/services/top-customer-dashboard.service';

import { CustomerDashboardService } from './application/services/customer-dashboard.service';

import { DashboardOverviewService } from './application/services/dashboard-overview.service';

import { DashboardLastFiveMonthsService } from './application/services/dashboard-last-five-months.service';

import { OrderModule } from '../order/order.module';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [
    OrderModule,
    CustomerModule,
  ],

  controllers: [
    DashboardController,
  ],

  providers: [
    // =======================
    // USE CASES
    // =======================

    GetOrderDashboardUseCase,

    GetOrderStatusDashboardUseCase,

    GetRevenueDashboardUseCase,

    GetRecentOrderDashboardUseCase,

    GetTopProductDashboardUseCase,

    GetTopCustomerDashboardUseCase,

    GetCustomerDashboardUseCase,

    GetDashboardOverviewUseCase,

    GetLastFiveMonthsDashboardUseCase,

    // =======================
    // SERVICES
    // =======================

    OrderDashboardService,

    OrderStatusDashboardService,

    RevenueDashboardService,

    RecentOrderDashboardService,

    TopProductDashboardService,

    TopCustomerDashboardService,

    CustomerDashboardService,

    DashboardOverviewService,

    DashboardLastFiveMonthsService,
  ],

  exports: [
    OrderDashboardService,

    OrderStatusDashboardService,

    RevenueDashboardService,

    RecentOrderDashboardService,

    TopProductDashboardService,

    TopCustomerDashboardService,

    CustomerDashboardService,

    DashboardOverviewService,

    DashboardLastFiveMonthsService,
  ],
})
export class DashboardModule {}