"use client";

import { useQuery } from "@tanstack/react-query";

import { getWallet } from "@/features/coins/api/coins.api";

export function useWallet() {
  return useQuery({
    queryKey: ["wallet"],

    queryFn: getWallet,
  });
}