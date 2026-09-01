"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { couponApi } from "@/features/cart/api/coupon.api";

export const useRemoveCoupon =
  () => {
    const queryClient =
      useQueryClient();

    const mutation =
      useMutation({
        mutationFn: () =>
          couponApi.removeCoupon(),

        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["cart"],
          });
        },
      });

    return {
      removeCoupon:
        mutation.mutateAsync,

      isPending:
        mutation.isPending,
    };
  };