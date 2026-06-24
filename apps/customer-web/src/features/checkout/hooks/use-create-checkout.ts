"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { checkoutApi } from "@/features/checkout/api/checkout.api";

import {
  CreateCheckoutSessionResponse,
} from "@/features/checkout/types/checkout.type";

export const useCreateCheckout = () => {
  /*
   |--------------------------------------------------------------------------
   | QUERY CLIENT
   |--------------------------------------------------------------------------
   */
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationKey: [
      "create-checkout-session",
    ],

    /*
     |--------------------------------------------------------------------------
     | CREATE CHECKOUT
     |--------------------------------------------------------------------------
     */
    mutationFn: async () => {
     
      /*
       |--------------------------------------------------------------------------
       | GET CART FROM CACHE
       |--------------------------------------------------------------------------
       */
      let cartData =
  queryClient.getQueryData([
    "cart",
  ]) as any;

/*
 |--------------------------------------------------------------------------
 | FALLBACK FETCH
 |--------------------------------------------------------------------------
 */
if (!cartData) {
  console.warn(
    "CART CACHE MISSING → FETCHING CART"
  );

  cartData =
    await queryClient.fetchQuery({
      queryKey: ["cart"],
    });
}

const cart =
  cartData;

      /*
       |--------------------------------------------------------------------------
       | VALIDATE CART
       |--------------------------------------------------------------------------
       */
      if (!cart) {
        throw new Error(
          "Cart not loaded yet"
        );
      }

      /*
       |--------------------------------------------------------------------------
       | EMPTY CART CHECK
       |--------------------------------------------------------------------------
       */
      if (
  !cart.cartItems ||
  cart.cartItems.length === 0
) {
  const error = new Error(
    "Cart is empty"
  );

  (error as Error & {
    code?: string;
  }).code = "EMPTY_CART";

  throw error;
}

      /*
       |--------------------------------------------------------------------------
       | CONVERTED CHECK
       |--------------------------------------------------------------------------
       */
      if (
        cart.status ===
        "CONVERTED"
      ) {
        throw new Error(
          "Cart already converted"
        );
      }

      /*
       |--------------------------------------------------------------------------
       | LOCKED CART
       |--------------------------------------------------------------------------
       |
       | IMPORTANT:
       | LOCKED means checkout session already exists.
       | Backend should reuse existing session.
       |--------------------------------------------------------------------------
       */
      if (
        cart.status ===
        "LOCKED"
      ) {
        console.warn(
          "CART ALREADY LOCKED → REUSING CHECKOUT SESSION"
        );
      }

      /*
       |--------------------------------------------------------------------------
       | CREATE / REUSE SESSION
       |--------------------------------------------------------------------------
       */
      const response =
        await checkoutApi.createSession();

      /*
       |--------------------------------------------------------------------------
       | INVALID RESPONSE
       |--------------------------------------------------------------------------
       */
      if (
        !response?.checkoutSessionId
      ) {
        throw new Error(
          "Invalid checkout session response"
        );
      }

      return response;
    },

    /*
     |--------------------------------------------------------------------------
     | SUCCESS
     |--------------------------------------------------------------------------
     */
    onSuccess: async (
      response: CreateCheckoutSessionResponse
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
       | REUSED SESSION
       |--------------------------------------------------------------------------
       */
      if (response?.reused) {
        console.warn(
          "ACTIVE CHECKOUT SESSION REUSED"
        );
      }
    },

    /*
     |--------------------------------------------------------------------------
     | ERROR
     |--------------------------------------------------------------------------
     */
    onError: (
      error: unknown
    ) => {
      console.error(
        "CREATE CHECKOUT ERROR:",
        error
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