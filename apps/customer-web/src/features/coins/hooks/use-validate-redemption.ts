"use client";

import { useMutation } from "@tanstack/react-query";

import { validateRedemption } from "@/features/coins/api/coins.api";

export function useValidateRedemption() {
  return useMutation({
    mutationFn: validateRedemption,
  });
}