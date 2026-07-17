import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { OrderRepository } from '@/modules/order/domain/repositories/order.repository';

import { Order } from '@/modules/order/domain/entities/order.entity';

import { OrderStatus } from '@/modules/order/domain/enums/order-status.enum';
import { PaymentStatus } from '@/modules/order/domain/enums/payment-status.enum';

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

    endDate.setHours(23, 59, 59, 999);
  }

  // =======================
  // 📅 PREDEFINED PERIOD
  // =======================

  else {
    const range = DashboardPeriodUtil.getRange(
      params.period ?? DashboardPeriod.OVERALL,
    );

    startDate = range.startDate;

    endDate = range.endDate;
  }

  const { data } = await this.orderRepo.findMany({
    page: 1,

    limit: Number.MAX_SAFE_INTEGER,

    from: startDate,

    to: endDate,

    // ✅ Ignore replacement orders for analytics
    excludeReplacementOrders: true,
  });

  return data;
}

  /**
   * 💰 Gross Revenue
   *
   * Includes every successful order.
   * Excludes cancelled orders.
   */
  private calculateGrossRevenue(orders: Order[]): number {
  return Number(
    orders
      .filter((order) =>
        [
          PaymentStatus.SUCCESS,
          PaymentStatus.CAPTURED,
          PaymentStatus.REFUNDED,
          PaymentStatus.PARTIALLY_REFUNDED,
        ].includes(order.paymentStatus),
      )
      .reduce((total, order) => total + order.grandTotal, 0)
      .toFixed(2),
  );
}

  /**
   * 💸 Refunded Revenue
   *
   * Sum of all refunded amounts.
   */
  private calculateRefundedRevenue(orders: Order[]): number {
  return Number(
    orders
      .filter(
        (order) =>
          order.paymentStatus === PaymentStatus.REFUNDED ||
          order.paymentStatus === PaymentStatus.PARTIALLY_REFUNDED,
      )
      .reduce((total, order) => total + order.grandTotal, 0)
      .toFixed(2),
  );
}

  /**
   * 💵 Net Revenue
   *
   * Gross Revenue - Refunds
   */
  private calculateNetRevenue(orders: Order[]): number {
  const grossRevenue = this.calculateGrossRevenue(orders);

  const refundedRevenue = this.calculateRefundedRevenue(orders);

  return Number((grossRevenue - refundedRevenue).toFixed(2));
}

  /**
   * 📊 Average Order Value
   */
  private calculateAverageOrderValue(orders: Order[]): number {
  const completedOrders = orders.filter((order) =>
    [
      PaymentStatus.SUCCESS,
      PaymentStatus.CAPTURED,
      PaymentStatus.REFUNDED,
      PaymentStatus.PARTIALLY_REFUNDED,
    ].includes(order.paymentStatus),
  );

  if (completedOrders.length === 0) {
    return 0;
  }

  const grossRevenue = this.calculateGrossRevenue(orders);

  return DashboardMathUtil.average(
    grossRevenue,
    completedOrders.length,
  );
}
}