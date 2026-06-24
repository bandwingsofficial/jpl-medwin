// src/modules/dashboard/application/services/order-dashboard.service.ts

import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { OrderRepository } from '@/modules/order/domain/repositories/order.repository';
import { OrderItemRepository } from '@/modules/order/domain/repositories/order-item.repository';

import { Order } from '@/modules/order/domain/entities/order.entity';
import { OrderItem } from '@/modules/order/domain/entities/order-item.entity';

import { OrderStatus } from '@/modules/order/domain/enums/order-status.enum';

import { DashboardPeriod } from '../../domain/enums/dashboard-period.enum';

import { DashboardPeriodUtil } from '../../utils/dashboard-period.util';

@Injectable()
export class OrderDashboardService {
  constructor(
    @Inject(TOKENS.ORDER_REPO)
    private readonly orderRepo: OrderRepository,

    @Inject(TOKENS.ORDER_ITEM_REPO)
    private readonly orderItemRepo: OrderItemRepository,
  ) {}

  /**
   * 📊 Main order stats
   */
  async getOrderStats(params: {
    period?: DashboardPeriod;

    from?: string;

    to?: string;
  }) {
    const orders =
      await this.fetchOrders(
        params,
      );

    const items =
      await this.fetchOrderItems(
        orders,
      );

    return {
      totalOrders:
        this.calculateTotalOrders(
          orders,
        ),

      deliveredOrders:
        this.calculateDeliveredOrders(
          orders,
        ),

      cancelledOrders:
        this.calculateCancelledOrders(
          orders,
        ),

      refundedOrders:
        this.calculateRefundedOrders(
          orders,
        ),

      returnedOrders:
        this.calculateReturnedOrders(
          orders,
        ),

      unitsSold:
        this.calculateUnitsSold(
          items,
        ),
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

      // Include the entire end day
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

    return data;
  }

  /**
   * 📦 Fetch order items
   */
  private async fetchOrderItems(
    orders: Order[],
  ): Promise<OrderItem[]> {
    if (!orders.length) {
      return [];
    }

    return this.orderItemRepo.findByOrderIds(
      orders.map(
        (order) => order.id,
      ),
    );
  }

  /**
   * 📊 Total orders
   */
  private calculateTotalOrders(
    orders: Order[],
  ): number {
    return orders.length;
  }

  /**
   * ✅ Delivered orders
   */
  private calculateDeliveredOrders(
    orders: Order[],
  ): number {
    return orders.filter(
      (order) =>
        order.status ===
        OrderStatus.DELIVERED,
    ).length;
  }

  /**
   * ❌ Cancelled orders
   */
  private calculateCancelledOrders(
    orders: Order[],
  ): number {
    return orders.filter(
      (order) =>
        order.status ===
        OrderStatus.CANCELLED,
    ).length;
  }

  /**
   * 💸 Refunded orders
   */
  private calculateRefundedOrders(
    orders: Order[],
  ): number {
    return orders.filter(
      (order) =>
        order.status ===
        OrderStatus.REFUNDED,
    ).length;
  }

  /**
   * ↩️ Returned orders
   */
  private calculateReturnedOrders(
    orders: Order[],
  ): number {
    return orders.filter(
      (order) =>
        order.status ===
        OrderStatus.RETURNED,
    ).length;
  }

  /**
   * 📦 Units sold
   */
  private calculateUnitsSold(
    items: OrderItem[],
  ): number {
    return items.reduce(
      (
        total,
        item,
      ) =>
        total +
        item.quantity,
      0,
    );
  }
}