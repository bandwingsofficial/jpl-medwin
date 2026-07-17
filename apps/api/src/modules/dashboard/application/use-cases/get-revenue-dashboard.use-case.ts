import { Injectable } from '@nestjs/common';

import { DashboardPeriod } from '../../domain/enums/dashboard-period.enum';

import { RevenueDashboardService } from '../services/revenue-dashboard.service';

@Injectable()
export class GetRevenueDashboardUseCase {
  constructor(private readonly revenueDashboardService: RevenueDashboardService) {}

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
    // 💰 REVENUE
    // =======================

    const data = await this.revenueDashboardService.getRevenueStats({
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

      ...data,
    };
  }
}
