"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { coinApi } from "@/infrastructure/api/coin.api";

// ========================================
// GET CONFIG
// ========================================

export const useCoinConfig =
  () => {
    return useQuery({
      queryKey: [
        "coin-config",
      ],

      queryFn:
        coinApi.getConfig,

      staleTime: 0,

      gcTime: 0,

      refetchOnMount: true,

      refetchOnWindowFocus: true,

      retry: false,
    });
  };

// ========================================
// CREATE / UPDATE CONFIG
// ========================================

export const useCreateCoinConfig =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn:
        coinApi.createConfig,

      onSuccess:
        async () => {
          // ========================================
          // FORCE REFETCH CONFIG
          // ========================================

          await queryClient.invalidateQueries(
            {
              queryKey: [
                "coin-config",
              ],
            }
          );

          await queryClient.refetchQueries(
            {
              queryKey: [
                "coin-config",
              ],
            }
          );

          // ========================================
          // REFRESH ANALYTICS
          // ========================================

          await queryClient.invalidateQueries(
            {
              queryKey: [
                "coin-analytics",
              ],
            }
          );

          await queryClient.refetchQueries(
            {
              queryKey: [
                "coin-analytics",
              ],
            }
          );
        },
    });
  };