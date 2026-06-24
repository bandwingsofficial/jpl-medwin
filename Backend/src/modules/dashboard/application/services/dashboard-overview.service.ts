import {
  Injectable,
} from '@nestjs/common';

import { DashboardPeriod } from '../../domain/enums/dashboard-period.enum';

import { OrderDashboardService } from './order-dashboard.service';
import { RevenueDashboardService } from './revenue-dashboard.service';
import { CustomerDashboardService } from './customer-dashboard.service';
import { TopProductDashboardService } from './top-product-dashboard.service';
import { TopCustomerDashboardService } from './top-customer-dashboard.service';
import { RecentOrderDashboardService } from './recent-order-dashboard.service';
import { OrderStatusDashboardService } from './order-status-dashboard.service';

@Injectable()
export class DashboardOverviewService {
  constructor(
    private readonly orderDashboardService: OrderDashboardService,

    private readonly revenueDashboardService: RevenueDashboardService,

    private readonly customerDashboardService: CustomerDashboardService,

    private readonly topProductDashboardService: TopProductDashboardService,

    private readonly topCustomerDashboardService: TopCustomerDashboardService,

    private readonly recentOrderDashboardService: RecentOrderDashboardService,

    private readonly orderStatusDashboardService: OrderStatusDashboardService,
  ) {}

  /**
   * 📊 Complete dashboard
   */
  async getOverview(params?: {
    period?: DashboardPeriod;

    from?: string;

    to?: string;
  }) {
    // =======================
    // 📅 QUERY
    // =======================

    const query = {
      period:
        params?.period ??
        DashboardPeriod.OVERALL,

      from:
        params?.from,

      to:
        params?.to,
    };

    // =======================
    // 🚀 LOAD ALL
    // =======================

    const [
      orders,

      revenue,

      customers,

      topProducts,

      topCustomers,

      recentOrders,

      orderStatuses,
    ] = await Promise.all([
      this.orderDashboardService.getOrderStats(
        query,
      ),

      this.revenueDashboardService.getRevenueStats(
        query,
      ),

      this.customerDashboardService.getCustomerStats(
        query,
      ),

      this.topProductDashboardService.getTopProducts(
        query,
      ),

      this.topCustomerDashboardService.getTopCustomers(
        query,
      ),

      this.recentOrderDashboardService.getRecentOrders(
        query,
      ),

      this.orderStatusDashboardService.getOrderStatuses(
        query,
      ),
    ]);

    // =======================
    // 📊 SUMMARY
    // =======================

    const summary = {
      totalOrders:
        orders.totalOrders,

      totalCustomers:
        customers.totalCustomers,

      unitsSold:
        orders.unitsSold,

      grossRevenue:
        revenue.grossRevenue,

      refundedRevenue:
        revenue.refundedRevenue,

      netRevenue:
        revenue.netRevenue,

      averageOrderValue:
        revenue.averageOrderValue,
    };

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      period:
        query.period,

      from:
        query.from,

      to:
        query.to,

      summary,

      orders,

      orderStatuses,

      revenue,

      customers,

      topProducts,

      topCustomers,

      recentOrders,
    };
  }
}