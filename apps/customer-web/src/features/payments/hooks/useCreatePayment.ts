"use client";

import { useMutation } from "@tanstack/react-query";

import { AxiosError } from "axios";

import { paymentService } from "../services/payment.service";

export const useCreatePayment = () => {
  return useMutation({
    mutationFn:
      paymentService.createPayment,

    retry: false,

    onError: (
      error: AxiosError
    ) => {
      console.error(
        "CREATE PAYMENT ERROR:",
        error.response?.data ||
          error.message
      );
    },
  });
};