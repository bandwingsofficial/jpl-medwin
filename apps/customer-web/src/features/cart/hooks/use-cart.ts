"use client";

import { useQuery } from "@tanstack/react-query";

import { cartApi } from "@/features/cart/api/cart.api";

import { useAuth } from "@/features/auth/hooks/use-auth";

export const useCart = () => {
  const { isAuthenticated } =
    useAuth();

  return useQuery({
    queryKey: ["cart"],

    queryFn: () =>
      cartApi.getCart(),

    enabled: isAuthenticated,

    staleTime: 1000 * 60 * 2,

    retry: 1,

    refetchOnWindowFocus: false,
  });
};