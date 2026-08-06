import { apiClient } from "@/infrastructure/api/axios-client";

import type {
  DashboardFilters,
} from "../types/dashboard.types";

const buildQuery = (
  filters?: DashboardFilters
) => {
  const params =
    new URLSearchParams();

  if (filters?.period) {
    params.append(
      "period",
      filters.period
    );
  }

  if (filters?.from) {
    params.append(
      "from",
      filters.from
    );
  }

  if (filters?.to) {
    params.append(
      "to",
      filters.to
    );
  }

  const query =
    params.toString();

  return query
    ? `?${query}`
    : "";
};

export const dashboardApi = {
  getOrders(
    filters?: DashboardFilters
  ) {
    return apiClient.get(
      `/admin/dashboard/orders${buildQuery(
        filters
      )}`
    );
  },

  getOrderStatus(
    filters?: DashboardFilters
  ) {
    return apiClient.get(
      `/admin/dashboard/order-status${buildQuery(
        filters
      )}`
    );
  },

  getRevenue(
    filters?: DashboardFilters
  ) {
    return apiClient.get(
      `/admin/dashboard/revenue${buildQuery(
        filters
      )}`
    );
  },

  getRecentOrders(
    filters?: DashboardFilters
  ) {
    return apiClient.get(
      `/admin/dashboard/recent-orders${buildQuery(
        filters
      )}`
    );
  },

  getTopProducts(
  filters?: DashboardFilters
) {
  return apiClient.get(
    `/admin/dashboard/top-products${buildQuery(
      filters
    )}`
  );
},

getTopCustomers(
  filters?: DashboardFilters
) {
  return apiClient.get(
    `/admin/dashboard/top-customers${buildQuery(
      filters
    )}`
  );
},
getCustomers(
  filters?: DashboardFilters
) {
  return apiClient.get(
    `/admin/dashboard/customers${buildQuery(
      filters
    )}`
  );
},
getLastFiveMonths() {
  return apiClient.get(
    "/admin/dashboard/last-five-months"
  );
},
};