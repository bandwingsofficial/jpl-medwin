"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { coinApi } from "@/infrastructure/api/coin.api";

import {
  showSuccess,
  showError,
} from "@/shared/store/toast.store";

export const useCoinWallet = (
  userId?: string
) => {
  return useQuery({
    queryKey: [
      "coin-wallet",
      userId,
    ],

    queryFn: () =>
      coinApi.getWallet(
        userId as string
      ),

    enabled: !!userId,
  });
};

export const useWalletBalance =
  (userId?: string) => {
    return useQuery({
      queryKey: [
        "wallet-balance",
        userId,
      ],

      queryFn: () =>
        coinApi.getWalletBalance(
          userId as string
        ),

      enabled: !!userId,
    });
  };

export const useCreditCoins =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn:
        coinApi.creditCoins,

      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(
          {
            queryKey: [
              "coin-wallet",
              variables.userId,
            ],
          }
        );

        queryClient.invalidateQueries(
          {
            queryKey: [
              "wallet-balance",
              variables.userId,
            ],
          }
        );

        queryClient.invalidateQueries(
          {
            queryKey: [
              "coin-transactions",
            ],
          }
        );

        queryClient.invalidateQueries(
          {
            queryKey: [
              "coin-analytics",
            ],
          }
        );

        showSuccess(
          "Coins credited successfully"
        );
      },

      onError: (error: any) => {
        showError(
          error?.response?.data
            ?.message ||
            "Failed to credit coins"
        );
      },
    });
  };

export const useExpireCoins =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn:
        coinApi.expireCoins,

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: [
              "coin-wallet",
            ],
          }
        );

        queryClient.invalidateQueries(
          {
            queryKey: [
              "wallet-balance",
            ],
          }
        );

        queryClient.invalidateQueries(
          {
            queryKey: [
              "coin-transactions",
            ],
          }
        );

        queryClient.invalidateQueries(
          {
            queryKey: [
              "coin-analytics",
            ],
          }
        );

        showSuccess(
          "Coin expiration completed successfully"
        );
      },

      onError: (error: any) => {
        showError(
          error?.response?.data
            ?.message ||
            "Failed to expire coins"
        );
      },
    });
  };

export const useRefundCoins =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn:
        coinApi.refundCoins,

      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(
          {
            queryKey: [
              "coin-wallet",
              variables.userId,
            ],
          }
        );

        queryClient.invalidateQueries(
          {
            queryKey: [
              "wallet-balance",
              variables.userId,
            ],
          }
        );

        queryClient.invalidateQueries(
          {
            queryKey: [
              "coin-transactions",
            ],
          }
        );

        queryClient.invalidateQueries(
          {
            queryKey: [
              "coin-analytics",
            ],
          }
        );

        showSuccess(
          "Coins refunded successfully"
        );
      },

      onError: (error: any) => {
        showError(
          error?.response?.data
            ?.message ||
            "Failed to refund coins"
        );
      },
    });
  };