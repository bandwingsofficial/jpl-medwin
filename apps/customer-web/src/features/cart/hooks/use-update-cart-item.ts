"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { cartApi } from "@/features/cart/api/cart.api";
import { localCartService } from "@/features/cart/hooks/local-cart.service";

import { useAuth } from "@/features/auth/hooks/use-auth";

interface UpdateCartItemPayload {
  productId: string;
  variantId: string;
  quantity: number;

  /*
   * Real cart item ID returned by backend.
   *
   * This is required only for authenticated users.
   * Guest cart continues using productId + variantId.
   */
  cartItemId?: string;
}

export const useUpdateCartItem = () => {
  const queryClient =
    useQueryClient();

  const {
    isAuthenticated,
  } = useAuth();

  return useMutation({
    mutationFn: async ({
      productId,
      variantId,
      quantity,
      cartItemId,
    }: UpdateCartItemPayload) => {
      /*
       |--------------------------------------------------------------------------
       | AUTHENTICATED USER
       |--------------------------------------------------------------------------
       */
      if (isAuthenticated) {
        if (!cartItemId) {
          throw new Error(
            "Cart item ID is required for authenticated cart.",
          );
        }

        return cartApi.updateItem(
          cartItemId,
          {
            quantity,
          },
        );
      }

      /*
       |--------------------------------------------------------------------------
       | GUEST USER
       |--------------------------------------------------------------------------
       */
      localCartService.updateQuantity(
        productId,
        variantId,
        quantity,
      );

      return true;
    },

    /*
     |--------------------------------------------------------------------------
     | SUCCESS
     |--------------------------------------------------------------------------
     */
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
};