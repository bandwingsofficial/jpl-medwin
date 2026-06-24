import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { OrderRepository } from '@/modules/order/domain/repositories/order.repository';

import { Order } from '@/modules/order/domain/entities/order.entity';

import { OrderStatus } from '@/modules/order/domain/enums/order-status.enum';

import { DashboardPeriod } from '../../domain/enums/dashboard-period.enum';

import { DashboardPeriodUtil } from '../../utils/dashboard-period.util';

@Injectable()
export class TopCustomerDashboardService {
  constructor(
    @Inject(TOKENS.ORDER_REPO)
    private readonly orderRepo: OrderRepository,
  ) {}

  /**
   * 🏆 Top customers
   */
  async getTopCustomers(params: {
    period?: DashboardPeriod;

    from?: string;

    to?: string;
  }) {
    const orders =
      await this.fetchOrders(
        params,
      );

    return this.calculateTopCustomers(
      orders,
    );
  }

  /**
   * 📦 Fetch orders
   */
  private async fetchOrders(params: {
    period?: DashboardPeriod;

    from?: string;

    to?: string;
  }): Promise<Order[]> {
    let startDate:
      | Date
      | undefined;

    let endDate:
      | Date
      | undefined;

    // =======================
    // 📅 CUSTOM RANGE
    // =======================
    if (
      params.from &&
      params.to
    ) {
      startDate = new Date(
        params.from,
      );

      endDate = new Date(
        params.to,
      );

      // Include entire end day
      endDate.setHours(
        23,
        59,
        59,
        999,
      );
    }

    // =======================
    // 📅 PREDEFINED PERIOD
    // =======================
    else {
      const range =
        DashboardPeriodUtil.getRange(
          params.period ??
            DashboardPeriod.OVERALL,
        );

      startDate =
        range.startDate;

      endDate =
        range.endDate;
    }

    const {
      data,
    } =
      await this.orderRepo.findMany({
        page: 1,

        limit:
          Number.MAX_SAFE_INTEGER,

        from: startDate,

        to: endDate,
      });

    return data.filter(
      (order) =>
        order.status ===
        OrderStatus.DELIVERED,
    );
  }

  /**
   * 📊 Calculate top customers
   */
  private calculateTopCustomers(
    orders: Order[],
  ) {
    const customers = new Map<
      string,
      {
        userId: string;

        totalOrders: number;

        totalSpent: number;
      }
    >();

    for (const order of orders) {
      const existing =
        customers.get(
          order.userId,
        );

      if (existing) {
        existing.totalOrders++;

        existing.totalSpent +=
          order.grandTotal;
      } else {
        customers.set(
          order.userId,
          {
            userId:
              order.userId,

            totalOrders: 1,

            totalSpent:
              order.grandTotal,
          },
        );
      }
    }

    return Array.from(
      customers.values(),
    )
      .sort(
        (
          a,
          b,
        ) =>
          b.totalSpent -
          a.totalSpent,
      )
      .slice(
        0,
        10,
      );
  }
}