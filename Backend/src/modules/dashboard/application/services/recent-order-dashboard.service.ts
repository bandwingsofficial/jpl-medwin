import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { OrderRepository } from '@/modules/order/domain/repositories/order.repository';

import { DashboardPeriod } from '../../domain/enums/dashboard-period.enum';

import { DashboardPeriodUtil } from '../../utils/dashboard-period.util';

@Injectable()
export class RecentOrderDashboardService {
  constructor(
    @Inject(TOKENS.ORDER_REPO)
    private readonly orderRepo: OrderRepository,
  ) {}

  /**
   * 📦 Recent orders
   */
  async getRecentOrders(params: {
    period?: DashboardPeriod;

    from?: string;

    to?: string;
  }) {
    let startDate: Date | undefined;

    let endDate: Date | undefined;

    // =======================
    // 📅 CUSTOM RANGE
    // =======================
    if (params.from && params.to) {
      startDate = new Date(params.from);

      endDate = new Date(params.to);

      // Include entire end day
      endDate.setHours(23, 59, 59, 999);
    }

    // =======================
    // 📅 PREDEFINED PERIOD
    // =======================
    else {
      const range = DashboardPeriodUtil.getRange(params.period ?? DashboardPeriod.OVERALL);

      startDate = range.startDate;

      endDate = range.endDate;
    }

    const { data } = await this.orderRepo.findMany({
      page: 1,

      limit: 10,

      from: startDate,

      to: endDate,

      sortBy: 'createdAt',

      sortOrder: 'desc',
    });

    return data;
  }
}
