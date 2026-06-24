import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "../services/dashboard.service";

import type {
  DashboardFilters,
} from "../types/dashboard.types";

export const useDashboardOrders = (
  filters?: DashboardFilters
) => {
  return useQuery({
    queryKey: [
      "dashboard",
      "orders",
      filters,
    ],

    queryFn: () =>
      dashboardService.getOrders(
        filters
      ),

   staleTime: 0,

    refetchInterval: 5000,
    refetchIntervalInBackground: true,

    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
};