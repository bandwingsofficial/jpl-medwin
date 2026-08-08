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
}

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: async ({
      productId,
      variantId,
      quantity,
    }: UpdateCartItemPayload) => {
      if (isAuthenticated) {
        return cartApi.updateItem(
          `${productId}-${variantId}`,
          {
            quantity,
          }
        );
      }

      localCartService.updateQuantity(
        productId,
        variantId,
        quantity
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