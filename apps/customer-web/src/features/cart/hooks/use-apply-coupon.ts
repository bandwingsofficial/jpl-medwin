"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { couponApi } from "@/features/cart/api/coupon.api";

export const useApplyCoupon =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: (
        couponCode: string
      ) =>
        couponApi.applyCoupon({
          couponCode,
        }),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["cart"],
        });
      },
    });
  };