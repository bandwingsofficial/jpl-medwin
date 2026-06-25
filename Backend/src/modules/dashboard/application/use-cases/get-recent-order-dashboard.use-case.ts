import { Injectable } from '@nestjs/common';

import { DashboardPeriod } from '../../domain/enums/dashboard-period.enum';

import { RecentOrderDashboardService } from '../services/recent-order-dashboard.service';

@Injectable()
export class GetRecentOrderDashboardUseCase {
  constructor(private readonly recentOrderDashboardService: RecentOrderDashboardService) {}

  async execute(params?: {
    period?: DashboardPeriod;

    from?: string;

    to?: string;
  }) {
    // =======================
    // 📅 PERIOD
    // =======================

    const period = params?.period ?? DashboardPeriod.OVERALL;

    // =======================
    // 📦 GET RECENT ORDERS
    // =======================

    const orders = await this.recentOrderDashboardService.getRecentOrders({
      period,

      from: params?.from,

      to: params?.to,
    });

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      period,

      from: params?.from,

      to: params?.to,

      count: orders.length,

      orders,
    };
  }
}
