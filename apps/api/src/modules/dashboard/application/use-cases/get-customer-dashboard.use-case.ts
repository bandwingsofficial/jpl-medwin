// src/modules/dashboard/application/use-cases/get-customer-dashboard.use-case.ts

import { Injectable } from '@nestjs/common';

import { DashboardPeriod } from '../../domain/enums/dashboard-period.enum';

import { CustomerDashboardService } from '../services/customer-dashboard.service';

@Injectable()
export class GetCustomerDashboardUseCase {
  constructor(private readonly customerDashboardService: CustomerDashboardService) {}

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
    // 👥 CUSTOMER METRICS
    // =======================

    const data = await this.customerDashboardService.getCustomerStats({
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
