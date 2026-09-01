"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { AxiosError } from "axios";

import { checkoutApi } from "@/features/checkout/api/checkout.api";

export const useExpireCheckout =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: (
        sessionId: string
      ) =>
        checkoutApi.expireSession(
          sessionId
        ),

      /*
       |--------------------------------------------------------------------------
       | SUCCESS
       |--------------------------------------------------------------------------
       */

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["cart"],
        });

        queryClient.invalidateQueries({
          queryKey: [
            "checkout-session",
          ],
        });
      },

      /*
       |--------------------------------------------------------------------------
       | ERROR
       |--------------------------------------------------------------------------
       */

      onError: (
        error: AxiosError<any>
      ) => {
        console.error(
          "EXPIRE CHECKOUT ERROR",
          error?.response?.data ||
            error.message
        );
      },
    });
  };