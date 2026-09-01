import { apiClient } from "@/infrastructure/api/axios-client";

import {
  CreatePaymentPayload,
  CreatePaymentResponse,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
} from "../types/payment.type";

export const paymentApi = {
  createPayment: async (
    payload: CreatePaymentPayload
  ): Promise<CreatePaymentResponse> => {
    const response = await apiClient.post("/payments/create", payload);

    return response.data;
  },

  verifyPayment: async (
    payload: VerifyPaymentPayload
  ): Promise<VerifyPaymentResponse> => {
    const response = await apiClient.post("/payments/verify", payload);

    return response.data;
  },
};