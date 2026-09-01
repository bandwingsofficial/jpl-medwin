// src/modules/dashboard/application/use-cases/get-dashboard-overview.use-case.ts

import { Injectable } from '@nestjs/common';

import { DashboardPeriod } from '../../domain/enums/dashboard-period.enum';

import { DashboardOverviewService } from '../services/dashboard-overview.service';

@Injectable()
export class GetDashboardOverviewUseCase {
  constructor(private readonly dashboardOverviewService: DashboardOverviewService) {}

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
    // 📊 DASHBOARD
    // =======================

    const data = await this.dashboardOverviewService.getOverview({
      period,

      from: params?.from,

      to: params?.to,
    });

    // =======================
    // 🚀 RESPONSE
    // =======================

    return data;
  }
}
