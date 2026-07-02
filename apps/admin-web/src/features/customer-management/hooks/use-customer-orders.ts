"use client";

import { useQuery } from "@tanstack/react-query";

import { customerOrderApi } from "../api/customer-order.api";

export const useCustomerOrders = (
  customerId: string,
) => {
  return useQuery({
    queryKey: [
      "customer-orders",
      customerId,
    ],

    queryFn: () =>
      customerOrderApi.getCustomerOrders(
        customerId,
      ),

    enabled: !!customerId,

    staleTime:
      1000 * 60 * 5,

    gcTime:
      1000 * 60 * 30,

    retry: 1,

    refetchOnWindowFocus:
      false,

    refetchOnReconnect:
      false,

    refetchOnMount:
      false,

    refetchInterval:
      false,
  });
};