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
      payload: AddToCartPayload
    ) => {
      if (
        isAuthenticated
      ) {
        return cartApi.addItem({
          productId:
            payload.productId,

          variantId:
            payload.variantId,

          quantity:
            payload.quantity,
        });
      }

      if (!payload.product) {
        throw new Error(
          "Product is required for guest cart."
        );
      }

      localCartService.addItem(
        payload.product,
        payload.quantity
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
       */
      await queryClient.invalidateQueries({
        queryKey: ["cart"],
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
        error?.response?.data ??
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