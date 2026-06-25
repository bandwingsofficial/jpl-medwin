// src/modules/dashboard/application/services/dashboard-last-five-months.service.ts

import { Injectable } from '@nestjs/common';

import { RevenueDashboardService } from './revenue-dashboard.service';

@Injectable()
export class DashboardLastFiveMonthsService {
  constructor(private readonly revenueDashboardService: RevenueDashboardService) {}

  async getOverview() {
    const months: {
      month: string;
      netRevenue: number;
    }[] = [];

    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);

      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);

      const revenue = await this.revenueDashboardService.getRevenueStats({
        from: startDate.toISOString(),
        to: endDate.toISOString(),
      });

      months.push({
        month: startDate.toLocaleString('default', {
          month: 'short',
        }),

        netRevenue: revenue.netRevenue,
      });
    }

    return {
      months,
    };
  }
}
