"use client";

import { useQuery } from "@tanstack/react-query";

import { coinApi } from "@/infrastructure/api/coin.api";

export const useCoinTransactions =
  (userId?: string) => {
    return useQuery({
      queryKey: [
        "coin-transactions",
        userId,
      ],

      queryFn: () =>
        coinApi.getTransactions(
          userId
        ),
    });
  };