"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { AxiosError } from "axios";

import { cartApi } from "@/features/cart/api/cart.api";
import { localCartService } from "@/features/cart/hooks/local-cart.service";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { Product } from "@/features/products/types/product.type";

interface AddToCartPayload {
  productId: string;

  variantId: string;

  quantity: number;

  product?: Product;
}

export const useAddToCart = () => {
  /*
   |--------------------------------------------------------------------------
   | QUERY CLIENT
   |--------------------------------------------------------------------------
   */
  const queryClient =
    useQueryClient();

  const {
    isAuthenticated,
  } = useAuth();

  return useMutation({
    /*
     |--------------------------------------------------------------------------
     | MUTATION
     |--------------------------------------------------------------------------
     */
    mutationFn: async (
      payload: AddToCartPayload,
    ) => {
      /*
       |--------------------------------------------------------------------------
       | AUTHENTICATED USER
       |--------------------------------------------------------------------------
       |
       | Logged-in users use the real backend cart.
       |
       */
      if (isAuthenticated) {
        return cartApi.addItem({
          productId:
            payload.productId,

          variantId:
            payload.variantId,

          quantity:
            payload.quantity,
        });
      }

      /*
       |--------------------------------------------------------------------------
       | GUEST USER
       |--------------------------------------------------------------------------
       |
       | Guest users use localStorage.
       |
       */
      if (!payload.product) {
        throw new Error(
          "Product is required for guest cart.",
        );
      }

      localCartService.addItem(
        payload.product,
        payload.variantId,
        payload.quantity,
      );

      return true;
    },

    /*
     |--------------------------------------------------------------------------
     | SUCCESS
     |--------------------------------------------------------------------------
     */
    onSuccess: async () => {
      /*
       |--------------------------------------------------------------------------
       | INVALIDATE CART
       |--------------------------------------------------------------------------
       |
       | This works for both:
       |
       | Guest:
       | localCartService -> useCart()
       |
       | Authenticated:
       | cartApi.getCart()
       |
       */
      await queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

      /*
       |--------------------------------------------------------------------------
       | INVALIDATE CHECKOUT SESSION
       |--------------------------------------------------------------------------
       |
       | Cart changes can affect checkout totals/session.
       |
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
      error: AxiosError,
    ) => {
      console.error(
        "ADD TO CART ERROR",
        error.response?.data ??
          error.message,
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