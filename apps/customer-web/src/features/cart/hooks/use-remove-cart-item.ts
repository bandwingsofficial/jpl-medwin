"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { cartApi } from "@/features/cart/api/cart.api";
import { localCartService } from "@/features/cart/hooks/local-cart.service";

import { useAuth } from "@/features/auth/hooks/use-auth";

export const useRemoveCartItem =
  () => {
    const queryClient =
      useQueryClient();

    const {
      isAuthenticated,
    } = useAuth();

    return useMutation({
      mutationFn: async (
        cartItemId: string
      ) => {
        if (
          isAuthenticated
        ) {
          return cartApi.removeItem(
            cartItemId
          );
        }

        localCartService.removeItem(
          cartItemId
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