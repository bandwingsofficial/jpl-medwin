"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import axios from "axios";

import {
  applyRewardsToCheckout,
} from "@/features/coins/api/coins.api";

import {
  showError,
  showSuccess,
} from "@/shared/store/toast.store";

interface ApplyRewardsPayload {
  checkoutSessionId: string;

  coins: number;
}

export function useRedeemCoins() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      checkoutSessionId,
      coins,
    }: ApplyRewardsPayload) =>
      applyRewardsToCheckout(
        checkoutSessionId,
        coins
      ),

    onSuccess: async () => {
      /*
       |--------------------------------------------------------------------------
       | SUCCESS MESSAGE
       |--------------------------------------------------------------------------
       */

      showSuccess(
        "Coins redeemed successfully"
      );

      /*
       |--------------------------------------------------------------------------
       | INVALIDATE WALLET
       |--------------------------------------------------------------------------
       */

      await queryClient.invalidateQueries({
        queryKey: ["wallet"],
      });

      /*
       |--------------------------------------------------------------------------
       | INVALIDATE WALLET TRANSACTIONS
       |--------------------------------------------------------------------------
       */

      await queryClient.invalidateQueries({
        queryKey: [
          "wallet-transactions",
        ],
      });

      /*
       |--------------------------------------------------------------------------
       | INVALIDATE CHECKOUT SESSION
       |--------------------------------------------------------------------------
       */

      await queryClient.invalidateQueries({
        queryKey: [
          "checkout-session",
        ],
      });

      /*
       |--------------------------------------------------------------------------
       | INVALIDATE CART
       |--------------------------------------------------------------------------
       */

      await queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },

    onError: (error) => {
      /*
       |--------------------------------------------------------------------------
       | HANDLE AXIOS ERRORS
       |--------------------------------------------------------------------------
       */

      if (
        axios.isAxiosError(error)
      ) {
        const message =
          error.response?.data
            ?.message;

        /*
         |-----------------------------------------------------------------------
         | INSUFFICIENT COINS
         |-----------------------------------------------------------------------
         */

        if (
          message?.toLowerCase().includes(
            "insufficient"
          )
        ) {
          showError(
            "Insufficient coins balance"
          );

          return;
        }

        /*
         |-----------------------------------------------------------------------
         | OTHER API ERRORS
         |-----------------------------------------------------------------------
         */

        showError(
          message ||
            "Failed to redeem coins"
        );

        return;
      }

      /*
       |--------------------------------------------------------------------------
       | FALLBACK ERROR
       |--------------------------------------------------------------------------
       */

      showError(
        "Something went wrong"
      );
    },
  });
}