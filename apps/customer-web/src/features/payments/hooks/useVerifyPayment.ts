"use client";

import { useMutation } from "@tanstack/react-query";

import { paymentService } from "../services/payment.service";

export const useVerifyPayment = () => {
  return useMutation({
    mutationKey: [
      "verify-payment",
    ],

    mutationFn:
      paymentService.verifyPayment,

    retry: false,

    onSuccess: (data) => {
      console.log(
        "VERIFY PAYMENT SUCCESS",
        data
      );
    },

    onError: (error) => {
      console.error(
        "VERIFY PAYMENT ERROR",
        error
      );
    },
  });
};