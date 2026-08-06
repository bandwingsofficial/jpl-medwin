"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { cartApi } from "@/features/cart/api/cart.api";

export const useClearCart = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: () =>
      cartApi.clearCart(),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
};