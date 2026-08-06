import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { OrderRepository } from '@/modules/order/domain/repositories/order.repository';

import { Order } from '@/modules/order/domain/entities/order.entity';

import { OrderStatus } from '@/modules/order/domain/enums/order-status.enum';
import { PaymentStatus } from '@/modules/order/domain/enums/payment-status.enum';

import { DashboardPeriod } from '../../domain/enums/dashboard-period.enum';

import { DashboardPeriodUtil } from '../../utils/dashboard-period.util';

@Injectable()
export class OrderStatusDashboardService {
  constructor(
    @Inject(TOKENS.ORDER_REPO)
    private readonly orderRepo: OrderRepository,
  ) {}

  /**
   * 📊 Order statuses
   */
  async getOrderStatuses(params: {
    period?: DashboardPeriod;

    from?: string;

    to?: string;
  }) {
    const orders = await this.fetchOrders(params);

    return {
      pending: this.calculatePendingOrders(orders),

      confirmed: this.calculateConfirmedOrders(orders),

      processing: this.calculateProcessingOrders(orders),

      shipped: this.calculateShippedOrders(orders),

      delivered: this.calculateDeliveredOrders(orders),

      cancelled: this.calculateCancelledOrders(orders),

      refunded: this.calculateRefundedOrders(orders),

      returned: this.calculateReturnedOrders(orders),
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

      limit: Number.MAX_SAFE_INTEGER,

      from: startDate,

      to: endDate,
      excludeReplacementOrders: true,
    });

    return data;
  }

  /**
   * ⏳ Pending payment
   */
  private calculatePendingOrders(orders: Order[]): number {
    return orders.filter((order) => order.status === OrderStatus.PENDING_PAYMENT).length;
  }

  /**
   * ✅ Confirmed
   */
  private calculateConfirmedOrders(orders: Order[]): number {
    return orders.filter((order) => order.status === OrderStatus.CONFIRMED).length;
  }

  /**
   * ⚙️ Processing
   */
  private calculateProcessingOrders(orders: Order[]): number {
    return orders.filter((order) => order.status === OrderStatus.PROCESSING).length;
  }

  /**
   * 🚚 Shipped
   */
  private calculateShippedOrders(orders: Order[]): number {
    return orders.filter((order) => order.status === OrderStatus.SHIPPED).length;
  }

  /**
   * 📦 Delivered
   */
  private calculateDeliveredOrders(orders: Order[]): number {
    return orders.filter((order) => order.status === OrderStatus.DELIVERED).length;
  }

  /**
   * ❌ Cancelled
   */
  private calculateCancelledOrders(orders: Order[]): number {
    return orders.filter((order) => order.status === OrderStatus.CANCELLED).length;
  }

  /**
   * 💸 Refunded
   */
  private calculateRefundedOrders(orders: Order[]): number {
  return orders.filter(
    (order) =>
      order.paymentStatus === PaymentStatus.REFUNDED ||
      order.paymentStatus === PaymentStatus.PARTIALLY_REFUNDED,
  ).length;
}

  /**
   * ↩️ Returned
   */
  private calculateReturnedOrders(orders: Order[]): number {
    return orders.filter((order) => order.status === OrderStatus.RETURNED).length;
  }
}
