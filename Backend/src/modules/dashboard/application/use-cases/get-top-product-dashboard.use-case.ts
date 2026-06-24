import {
  Injectable,
} from '@nestjs/common';

import { DashboardPeriod } from '../../domain/enums/dashboard-period.enum';

import { TopProductDashboardService } from '../services/top-product-dashboard.service';

@Injectable()
export class GetTopProductDashboardUseCase {
  constructor(
    private readonly topProductDashboardService: TopProductDashboardService,
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
    // 🏆 TOP PRODUCTS
    // =======================

    const products =
      await this.topProductDashboardService.getTopProducts(
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

      count:
        products.length,

      products,
    };
  }
}