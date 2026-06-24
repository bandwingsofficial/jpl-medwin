"use client";

import { useQuery } from "@tanstack/react-query";

import { getWalletTransactions } from "@/features/coins/api/coins.api";

export function useTransactions() {
  return useQuery({
    queryKey: ["wallet-transactions"],

    queryFn: getWalletTransactions,
  });
}