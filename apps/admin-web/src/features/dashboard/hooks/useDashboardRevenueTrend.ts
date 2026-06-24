import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "../services/dashboard.service";

export const useDashboardRevenueTrend =
  () => {
    return useQuery({
      queryKey: [
        "dashboard",
        "revenue-trend",
      ],

      queryFn: () =>
        dashboardService.getLastFiveMonths(),

      staleTime: 0,

    refetchInterval: 5000,
    refetchIntervalInBackground: true,

    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    });
  };