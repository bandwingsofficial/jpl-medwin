"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { cartApi } from "@/features/cart/api/cart.api";
import { localCartService } from "@/features/cart/hooks/local-cart.service";

import { useAuth } from "@/features/auth/hooks/use-auth";

interface RemoveCartItemPayload {
  productId: string;
  variantId: string;
  cartItemId?: string;
}

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: async ({
      productId,
      variantId,
      cartItemId,
    }: RemoveCartItemPayload) => {
      if (isAuthenticated) {
        if (!cartItemId) {
          throw new Error("Cart item ID is required.");
        }

        return cartApi.removeItem(cartItemId);
      }

      localCartService.removeItem(
        productId,
        variantId
      );

      return true;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
};