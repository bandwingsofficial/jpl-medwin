import { Injectable } from '@nestjs/common';

import { DashboardPeriod } from '../../domain/enums/dashboard-period.enum';

import { TopCustomerDashboardService } from '../services/top-customer-dashboard.service';

@Injectable()
export class GetTopCustomerDashboardUseCase {
  constructor(private readonly topCustomerDashboardService: TopCustomerDashboardService) {}

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
    // 🏆 TOP CUSTOMERS
    // =======================

    const customers = await this.topCustomerDashboardService.getTopCustomers({
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

      count: customers.length,

      customers,
    };
  }
}
