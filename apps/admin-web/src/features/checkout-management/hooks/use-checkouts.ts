"use client";

import { useQuery } from "@tanstack/react-query";
import { checkoutApi } from "../api/checkout.api";
import { GetCheckoutsParams } from "../types/checkout.type";

/*
|--------------------------------------------------------------------------
| GET ABANDONED CHECKOUTS HOOK
|--------------------------------------------------------------------------
*/
export const useCheckouts = (params?: GetCheckoutsParams) => {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const search = params?.search || "";
  const status = params?.status || "";
  const from = params?.from || "";
  const to = params?.to || "";
  const sortBy = params?.sortBy || "";
  const sortOrder = params?.sortOrder || "desc";

  return useQuery({
    queryKey: [
      "admin-checkouts",
      page,
      limit,
      search,
      status,
      from,
      to,
      sortBy,
      sortOrder,
    ],
    queryFn: async () => {
      const response = await checkoutApi.getCheckouts({
        page,
        limit,
        search,
        status,
        from: from || undefined,
        to: to || undefined,
        sortBy: sortBy || undefined,
        sortOrder: (sortOrder as "asc" | "desc") || undefined,
      });

      return response;
    },
    staleTime: 1000 * 30, // 30s
    gcTime: 1000 * 60 * 15, // 15 mins
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchInterval: 15_000,
    refetchIntervalInBackground: true,
  });
};

/*
|--------------------------------------------------------------------------
| GET CHECKOUT DETAILS HOOK
|--------------------------------------------------------------------------
*/
export const useCheckoutDetails = (id: string) => {
  return useQuery({
    queryKey: ["admin-checkout-detail", id],
    queryFn: async () => {
      const response = await checkoutApi.getCheckoutDetails(id);
      return response;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 15,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
