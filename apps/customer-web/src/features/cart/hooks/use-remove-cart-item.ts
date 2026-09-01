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
        let targetCartItemId = cartItemId;

        if (!targetCartItemId) {
          const cartData = queryClient.getQueryData<any>(["cart"]);
          const foundItem = cartData?.cartItems?.find(
            (item: any) =>
              (variantId && item.variantId === variantId) ||
              (!variantId && item.productId === productId),
          );
          targetCartItemId = foundItem?.id;
        }

        if (!targetCartItemId) {
          try {
            const freshCart = await cartApi.getCart();
            const foundItem = freshCart?.cartItems?.find(
              (item: any) =>
                (variantId && item.variantId === variantId) ||
                (!variantId && item.productId === productId),
            );
            targetCartItemId = foundItem?.id;
          } catch {
            // Ignore fetch error
          }
        }

        if (!targetCartItemId) {
          throw new Error("Cart item ID is required.");
        }

        return cartApi.removeItem(targetCartItemId);
      }

      localCartService.removeItem(
        productId,
        variantId
      );

      return true;
    },

    onSuccess: async (data: any) => {
      if (data && typeof data === "object" && Array.isArray(data.cartItems)) {
        queryClient.setQueryData(["cart"], data);
      }

      await queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },

    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to remove item from cart";
      console.error(
        "REMOVE CART ITEM ERROR:",
        errorMessage
      );
    },

    retry: false,
  });
};