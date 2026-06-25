import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CustomerRepository } from '@/modules/customer/domain/repositories/customer.repository';

import { OrderRepository } from '@/modules/order/domain/repositories/order.repository';

import { DashboardPeriod } from '../../domain/enums/dashboard-period.enum';

import { DashboardPeriodUtil } from '../../utils/dashboard-period.util';

import { DashboardMathUtil } from '../../utils/dashboard-math.util';

@Injectable()
export class CustomerDashboardService {
  constructor(
    @Inject(TOKENS.CUSTOMER_REPO)
    private readonly customerRepo: CustomerRepository,

    @Inject(TOKENS.ORDER_REPO)
    private readonly orderRepo: OrderRepository,
  ) {}

  /**
   * 👥 Customer metrics
   */
  async getCustomerStats(params: {
    period?: DashboardPeriod;

    from?: string;

    to?: string;
  }) {
    const totalCustomers = await this.getTotalCustomers();

    const { totalOrders, repeatCustomers, averageOrdersPerCustomer, averageSpendPerCustomer } =
      await this.getOrderMetrics(params, totalCustomers);

    return {
      totalCustomers,

      totalOrders,

      repeatCustomers,

      averageOrdersPerCustomer,

      averageSpendPerCustomer,
    };
  }

  /**
   * 👥 Total customers
   */
  private async getTotalCustomers(): Promise<number> {
    const result = await this.customerRepo.findMany({
      page: 1,

      limit: Number.MAX_SAFE_INTEGER,
    });

    return result.total;
  }

  /**
   * 📦 Order metrics
   */
  private async getOrderMetrics(
    params: {
      period?: DashboardPeriod;

      from?: string;

      to?: string;
    },
    totalCustomers: number,
  ) {
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

    const { data: orders } = await this.orderRepo.findMany({
      page: 1,

      limit: Number.MAX_SAFE_INTEGER,

      from: startDate,

      to: endDate,
    });

    const customerMap = new Map<
      string,
      {
        orders: number;

        spent: number;
      }
    >();

    for (const order of orders) {
      const existing = customerMap.get(order.userId);

      if (existing) {
        existing.orders++;

        existing.spent += order.grandTotal;
      } else {
        customerMap.set(order.userId, {
          orders: 1,

          spent: order.grandTotal,
        });
      }
    }

    const repeatCustomers = Array.from(customerMap.values()).filter(
      (customer) => customer.orders > 1,
    ).length;

    const totalRevenue = Array.from(customerMap.values()).reduce(
      (total, customer) => total + customer.spent,
      0,
    );

    return {
      totalOrders: orders.length,

      repeatCustomers,

      averageOrdersPerCustomer: DashboardMathUtil.average(orders.length, totalCustomers),

      averageSpendPerCustomer: DashboardMathUtil.average(totalRevenue, totalCustomers),
    };
  }
}
