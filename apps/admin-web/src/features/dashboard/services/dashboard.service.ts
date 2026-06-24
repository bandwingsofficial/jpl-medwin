import { dashboardApi } from "../api/dashboard.api";

import type {
  DashboardFilters,
  OrdersDashboardResponse,
  OrderStatusDashboardResponse,
  RevenueDashboardResponse,
  RecentOrdersResponse,
  TopCustomersResponse,
  TopProductsResponse,
  RevenueTrendResponse,
} from "../types/dashboard.types";

export const dashboardService = {
  async getOrders(
    filters?: DashboardFilters
  ) {
    const { data } =
      await dashboardApi.getOrders(
        filters
      );

    return data as OrdersDashboardResponse;
  },

  async getOrderStatus(
    filters?: DashboardFilters
  ) {
    const { data } =
      await dashboardApi.getOrderStatus(
        filters
      );

    return data as OrderStatusDashboardResponse;
  },

  async getRevenue(
    filters?: DashboardFilters
  ) {
    const { data } =
      await dashboardApi.getRevenue(
        filters
      );

    return data as RevenueDashboardResponse;
  },

  async getRecentOrders(
    filters?: DashboardFilters
  ) {
    const { data } =
      await dashboardApi.getRecentOrders(
        filters
      );

    return data as RecentOrdersResponse;
  },
  async getTopProducts(
  filters?: DashboardFilters
) {
  const { data } =
    await dashboardApi.getTopProducts(
      filters
    );

  return data as TopProductsResponse;
},

async getTopCustomers(
  filters?: DashboardFilters
) {
  const { data } =
    await dashboardApi.getTopCustomers(
      filters
    );

  return data as TopCustomersResponse;
},async getCustomers(
  filters?: DashboardFilters
) {
  const { data } =
    await dashboardApi.getCustomers(
      filters
    );

  return data;
},
async getLastFiveMonths() {
  const { data } =
    await dashboardApi.getLastFiveMonths();

  return data as RevenueTrendResponse;
},
};