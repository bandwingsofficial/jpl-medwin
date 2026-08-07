"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { cartApi } from "@/features/cart/api/cart.api";
import { localCartService } from "@/features/cart/hooks/local-cart.service";

import { useAuth } from "@/features/auth/hooks/use-auth";

export const useUpdateCartItem =
  () => {
    const queryClient =
      useQueryClient();

    const {
      isAuthenticated,
    } = useAuth();

    return useMutation({
      mutationFn: async ({
        cartItemId,
        quantity,
      }: {
        cartItemId: string;

        quantity: number;
      }) => {
        if (
          isAuthenticated
        ) {
          return cartApi.updateItem(
            cartItemId,
            {
              quantity,
            }
          );
        }

        localCartService.updateQuantity(
          cartItemId,
          quantity
        );

        return true;
      },

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["cart"],
        });
      },
    });
  };