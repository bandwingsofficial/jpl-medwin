import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { OrderRepository } from '@/modules/order/domain/repositories/order.repository';

import { OrderItemRepository } from '@/modules/order/domain/repositories/order-item.repository';

import { Order } from '@/modules/order/domain/entities/order.entity';

import { OrderItem } from '@/modules/order/domain/entities/order-item.entity';

import { DashboardPeriod } from '../../domain/enums/dashboard-period.enum';

import { DashboardPeriodUtil } from '../../utils/dashboard-period.util';

@Injectable()
export class TopProductDashboardService {
  constructor(
    @Inject(TOKENS.ORDER_REPO)
    private readonly orderRepo: OrderRepository,

    @Inject(TOKENS.ORDER_ITEM_REPO)
    private readonly orderItemRepo: OrderItemRepository,
  ) {}

  /**
   * 🏆 Top products
   */
  async getTopProducts(params: {
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

    return this.calculateTopProducts(
      items,
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

    return data;
  }

  /**
   * 📦 Fetch items
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
   * 📊 Calculate top products
   */
  private calculateTopProducts(
    items: OrderItem[],
  ) {
    const map = new Map<
      string,
      {
        productId: string;

        productName: string;

        quantitySold: number;

        revenue: number;
      }
    >();

    for (const item of items) {
      const existing =
        map.get(
          item.productId,
        );

      if (existing) {
        existing.quantitySold +=
          item.quantity;

        existing.revenue +=
          item.totalPrice;
      } else {
        map.set(
          item.productId,
          {
            productId:
              item.productId,

            productName:
              item.productName,

            quantitySold:
              item.quantity,

            revenue:
              item.totalPrice,
          },
        );
      }
    }

    return Array.from(
      map.values(),
    )
      .sort(
        (
          a,
          b,
        ) =>
          b.quantitySold -
          a.quantitySold,
      )
      .slice(
        0,
        10,
      );
  }
}