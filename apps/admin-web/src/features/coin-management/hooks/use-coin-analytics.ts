"use client";

import { useQuery } from "@tanstack/react-query";

import { coinApi } from "@/infrastructure/api/coin.api";

export const useCoinAnalytics = () => {
  return useQuery({
    queryKey: ["coin-analytics"],

    queryFn: coinApi.getAnalytics,
  });
};