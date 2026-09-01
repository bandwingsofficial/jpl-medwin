"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { ordersApi } from "@/features/orders/api/orders.api";

export const useCancelOrder = () => {
  /*
  |--------------------------------------------------------------------------
  | QUERY CLIENT
  |--------------------------------------------------------------------------
  */

  const queryClient =
    useQueryClient();

  /*
  |--------------------------------------------------------------------------
  | MUTATION
  |--------------------------------------------------------------------------
  */

  return useMutation({
    mutationFn: ({
      orderId,
      reason,
    }: {
      orderId: string;
      reason: string;
    }) =>
      ordersApi.cancelOrder(
        orderId,
        {
          reason,
        }
      ),

    /*
    |--------------------------------------------------------------------------
    | SUCCESS
    |--------------------------------------------------------------------------
    */

    onSuccess: async (
      data,
      variables
    ) => {
     
      /*
      |--------------------------------------------------------------------------
      | INVALIDATE ORDER LIST
      |--------------------------------------------------------------------------
      */

      await queryClient.invalidateQueries({
        queryKey: ["orders", "list"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["orders", "details", variables.orderId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["order", variables.orderId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },

    /*
    |--------------------------------------------------------------------------
    | ERROR
    |--------------------------------------------------------------------------
    */

    onError: (error) => {
      console.error(
        "CANCEL ORDER ERROR",
        error
      );
    },
  });
};