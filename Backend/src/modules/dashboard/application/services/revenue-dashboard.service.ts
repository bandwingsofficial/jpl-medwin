import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { OrderRepository } from '@/modules/order/domain/repositories/order.repository';

import { Order } from '@/modules/order/domain/entities/order.entity';

import { OrderStatus } from '@/modules/order/domain/enums/order-status.enum';

import { DashboardPeriod } from '../../domain/enums/dashboard-period.enum';

import { DashboardPeriodUtil } from '../../utils/dashboard-period.util';

import { DashboardMathUtil } from '../../utils/dashboard-math.util';

@Injectable()
export class RevenueDashboardService {
  constructor(
    @Inject(TOKENS.ORDER_REPO)
    private readonly orderRepo: OrderRepository,
  ) {}

  /**
   * 💰 Revenue metrics
   */
  async getRevenueStats(params: {
    period?: DashboardPeriod;

    from?: string;

    to?: string;
  }) {
    const orders = await this.fetchOrders(params);

    return {
      grossRevenue: this.calculateGrossRevenue(orders),

      refundedRevenue: this.calculateRefundedRevenue(orders),

      netRevenue: this.calculateNetRevenue(orders),

      averageOrderValue: this.calculateAverageOrderValue(orders),
    };
  }

  /**
   * 📦 Fetch orders
   */
  private async fetchOrders(params: {
    period?: DashboardPeriod;

    from?: string;

    to?: string;
  }): Promise<Order[]> {
    let startDate: Date | undefined;

    let endDate: Date | undefined;

    // =======================
    // 📅 CUSTOM RANGE
    // =======================

    if (params.from && params.to) {
      startDate = new Date(params.from);

      endDate = new Date(params.to);

      // include entire end day
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

      limit: Number.MAX_SAFE_INTEGER,

      from: startDate,

      to: endDate,
    });

    return data;
  }

  /**
   * 💰 Gross revenue
   *
   * Total revenue generated
   * before refunds.
   */
  private calculateGrossRevenue(orders: Order[]): number {
    return Number(
      orders
        .filter((order) => order.status === OrderStatus.DELIVERED)
        .reduce((total, order) => total + order.grandTotal, 0)
        .toFixed(2),
    );
  }

  /**
   * 💸 Refunded revenue
   */
  private calculateRefundedRevenue(orders: Order[]): number {
    return Number(
      orders
        .filter((order) => !!order.refundedAt)
        .reduce((total, order) => total + order.grandTotal, 0)
        .toFixed(2),
    );
  }

  /**
   * 💵 Net revenue
   */
  private calculateNetRevenue(orders: Order[]): number {
    const grossRevenue = this.calculateGrossRevenue(orders);

    const refundedRevenue = this.calculateRefundedRevenue(orders);

    return Number((grossRevenue - refundedRevenue).toFixed(2));
  }

  /**
   * 📊 Average order value
   */
  private calculateAverageOrderValue(orders: Order[]): number {
    const deliveredOrders = orders.filter((order) => order.status === OrderStatus.DELIVERED);

    const grossRevenue = this.calculateGrossRevenue(orders);

    return DashboardMathUtil.average(grossRevenue, deliveredOrders.length);
  }
}
