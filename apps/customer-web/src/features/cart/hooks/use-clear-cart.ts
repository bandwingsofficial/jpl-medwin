"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { cartApi } from "@/features/cart/api/cart.api";
import { localCartService } from "@/features/cart/hooks/local-cart.service";

import { useAuth } from "@/features/auth/hooks/use-auth";

export const useClearCart = () => {
  const queryClient =
    useQueryClient();

  const {
    isAuthenticated,
  } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (
        isAuthenticated
      ) {
        return cartApi.clearCart();
      }

      localCartService.clear();

      return true;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
};