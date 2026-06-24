// src/modules/dashboard/application/use-cases/get-order-dashboard.use-case.ts

import {
  Injectable,
} from '@nestjs/common';

import { DashboardPeriod } from '../../domain/enums/dashboard-period.enum';

import { OrderDashboardService } from '../services/order-dashboard.service';

@Injectable()
export class GetOrderDashboardUseCase {
  constructor(
    private readonly orderDashboardService: OrderDashboardService,
  ) {}

  async execute(params?: {
    period?: DashboardPeriod;

    from?: string;

    to?: string;
  }) {
    // =======================
    // 📅 PERIOD
    // =======================

    const period =
      params?.period ??
      DashboardPeriod.OVERALL;

    // =======================
    // 📊 GET ORDER STATS
    // =======================

    const stats =
      await this.orderDashboardService.getOrderStats(
        {
          period,

          from:
            params?.from,

          to:
            params?.to,
        },
      );

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      period,

      from:
        params?.from,

      to:
        params?.to,

      totalOrders:
        stats.totalOrders,

      deliveredOrders:
        stats.deliveredOrders,

      cancelledOrders:
        stats.cancelledOrders,

      refundedOrders:
        stats.refundedOrders,

      returnedOrders:
        stats.returnedOrders,

      unitsSold:
        stats.unitsSold,
    };
  }
}