"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { coinApi } from "@/infrastructure/api/coin.api";

// ========================================
// GET TIERS
// ========================================

export const useRewardTiers =
  () => {
    return useQuery({
      queryKey: [
        "coin-tiers",
      ],

      queryFn:
        coinApi.getRewardTiers,
    });
  };

// ========================================
// CREATE TIER
// ========================================

export const useCreateRewardTier =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn:
        coinApi.createRewardTier,

      onSuccess: () => {
        // REFRESH TIER TABLE
        queryClient.invalidateQueries(
          {
            queryKey: [
              "coin-tiers",
            ],
          }
        );

        // REFRESH ANALYTICS
        queryClient.invalidateQueries(
          {
            queryKey: [
              "coin-analytics",
            ],
          }
        );
      },
    });
  };