"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { AxiosError } from "axios";

import { cartApi } from "@/features/cart/api/cart.api";

interface AddToCartPayload {
  productId: string;

  variantId: string;

  quantity: number;
}

export const useAddToCart = () => {
  /*
   |--------------------------------------------------------------------------
   | QUERY CLIENT
   |--------------------------------------------------------------------------
   */
  const queryClient =
    useQueryClient();

  return useMutation({
    /*
     |--------------------------------------------------------------------------
     | MUTATION
     |--------------------------------------------------------------------------
     */
    mutationFn: (
      payload: AddToCartPayload
    ) =>
      cartApi.addItem(payload),

    /*
     |--------------------------------------------------------------------------
     | SUCCESS
     |--------------------------------------------------------------------------
     */
    onSuccess: async (
      data
    ) => {
     
      /*
       |--------------------------------------------------------------------------
       | INVALIDATE CART
       |--------------------------------------------------------------------------
       */
      await queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

      /*
       |--------------------------------------------------------------------------
       | INVALIDATE CHECKOUT SESSION
       |--------------------------------------------------------------------------
       |
       | IMPORTANT:
       | Add-to-cart may expire checkout session
       | during locked cart recovery.
       |--------------------------------------------------------------------------
       */
      await queryClient.invalidateQueries({
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
        "ADD TO CART ERROR",
        error?.response?.data ||
          error.message
      );
    },

    /*
     |--------------------------------------------------------------------------
     | RETRY
     |--------------------------------------------------------------------------
     */
    retry: false,
  });
};