import {
  Injectable,
} from '@nestjs/common';

import { DashboardPeriod } from '../../domain/enums/dashboard-period.enum';

import { OrderStatusDashboardService } from '../services/order-status-dashboard.service';

@Injectable()
export class GetOrderStatusDashboardUseCase {
  constructor(
    private readonly orderStatusDashboardService: OrderStatusDashboardService,
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
    // 📊 GET STATUS STATS
    // =======================

    const statuses =
      await this.orderStatusDashboardService.getOrderStatuses(
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

      pending:
        statuses.pending,

      confirmed:
        statuses.confirmed,

      processing:
        statuses.processing,

      shipped:
        statuses.shipped,

      delivered:
        statuses.delivered,

      cancelled:
        statuses.cancelled,

      refunded:
        statuses.refunded,

      returned:
        statuses.returned,
    };
  }
}