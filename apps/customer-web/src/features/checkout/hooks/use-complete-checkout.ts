"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { AxiosError } from "axios";

import { checkoutApi } from "@/features/checkout/api/checkout.api";

export const useCompleteCheckout =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: (
        sessionId: string
      ) =>
        checkoutApi.completeSession(
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
          "COMPLETE CHECKOUT ERROR",
          error?.response?.data ||
            error.message
        );
      },
    });
  };