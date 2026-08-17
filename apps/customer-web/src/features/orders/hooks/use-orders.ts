import { useQuery } from "@tanstack/react-query";

import { ordersApi } from "../api/orders.api";

export const useOrders = () => {
  return useQuery({
    /*
    |--------------------------------------------------------------------------
    | QUERY KEY
    |--------------------------------------------------------------------------
    */

    queryKey: ["orders", "list"],

    /*
    |--------------------------------------------------------------------------
    | QUERY FN
    |--------------------------------------------------------------------------
    */

    queryFn: async () => {
      const data = await ordersApi.getMyOrders();

      return Array.isArray(data) ? data : [];
    },

    /*
    |--------------------------------------------------------------------------
    | CACHE
    |--------------------------------------------------------------------------
    */

    // Keep the existing order list fresh in cache.
    // React Query will immediately use cached data when available.
    staleTime: 1000 * 60 * 2,

    gcTime: 1000 * 60 * 10,

    /*
    |--------------------------------------------------------------------------
    | RETRY
    |--------------------------------------------------------------------------
    */

    retry: 2,
    retryDelay: 1000,

    /*
    |--------------------------------------------------------------------------
    | REFRESH BEHAVIOR
    |--------------------------------------------------------------------------
    */

    // Do not refetch just because the component mounts again.
    refetchOnMount: false,

    // Still fetch if the network connection was lost and restored.
    refetchOnReconnect: true,

    // Do not refetch every time the user switches back to the tab.
    refetchOnWindowFocus: false,

    // IMPORTANT:
    // Remove the 30-second automatic polling.
    refetchInterval: false,
  });
};