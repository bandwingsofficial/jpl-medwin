import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { ordersApi } from "../api/orders.api";

export const useOrderDetails = (
  orderId: string
) => {
  return useQuery({
    /*
    |--------------------------------------------------------------------------
    | QUERY KEY
    |--------------------------------------------------------------------------
    */

    queryKey: [
      "orders",
      "details",
      orderId,
    ],

    /*
    |--------------------------------------------------------------------------
    | QUERY FN
    |--------------------------------------------------------------------------
    */

    queryFn: () =>
      ordersApi.getOrderDetails(
        orderId
      ),

    /*
    |--------------------------------------------------------------------------
    | ENABLED
    |--------------------------------------------------------------------------
    */

    enabled: !!orderId,

    /*
    |--------------------------------------------------------------------------
    | CACHE
    |--------------------------------------------------------------------------
    */

    staleTime:
      1000 * 60 * 2,

    gcTime:
      1000 * 60 * 10,

    /*
    |--------------------------------------------------------------------------
    | RETRY
    |--------------------------------------------------------------------------
    */

    retry: 2,

    retryDelay: 1000,

    /*
    |--------------------------------------------------------------------------
    | REFETCH
    |--------------------------------------------------------------------------
    */

    refetchOnMount: true,

    refetchOnReconnect: true,

    refetchOnWindowFocus: true,

    /*
    |--------------------------------------------------------------------------
    | AUTO REFRESH
    |--------------------------------------------------------------------------
    */

    refetchInterval: ({
      state,
    }) => {
      const status =
        state.data?.status;

      /*
      |--------------------------------------------------------------------------
      | AUTO REFRESH ACTIVE ORDERS
      |--------------------------------------------------------------------------
      */

      if (
        status ===
          "PROCESSING" ||
        status === "SHIPPED"
      ) {
        return 1000 * 20;
      }

      return false;
    },
  });
};

/*
|--------------------------------------------------------------------------
| CREATE PAYMENT
|--------------------------------------------------------------------------
*/

export const useCreatePayment =
  () => {
    return useMutation({
      mutationFn: (
        orderId: string
      ) =>
        ordersApi.createPayment(
          orderId
        ),
    });
  };

/*
|--------------------------------------------------------------------------
| PROCESS ORDER
|--------------------------------------------------------------------------
*/

export const useProcessOrder =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: (
        orderId: string
      ) =>
        ordersApi.processOrder(
          orderId
        ),

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: [
              "orders",
            ],
          }
        );
      },
    });
  };

/*
|--------------------------------------------------------------------------
| REFUND ORDER
|--------------------------------------------------------------------------
*/

export const useRefundOrder =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: (
        orderId: string
      ) =>
        ordersApi.refundOrder(
          orderId
        ),

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: [
              "orders",
            ],
          }
        );
      },
    });
  };