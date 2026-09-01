import { AxiosError } from "axios";

import { paymentApi } from "../api/payment.api";

import {
  CreatePaymentPayload,
  VerifyPaymentPayload,
} from "../types/payment.type";

export const paymentService = {
  /*
   |--------------------------------------------------------------------------
   | CREATE PAYMENT
   |--------------------------------------------------------------------------
   */

 createPayment: async (
  payload: CreatePaymentPayload
) => {
  try {
    const response =
      await paymentApi.createPayment(
        payload
      );

    return response;
  } catch (error) {
      const axiosError =
        error as AxiosError;

      console.error(
        "CREATE PAYMENT SERVICE ERROR:",
        axiosError.response?.data ||
          axiosError.message
      );

      throw error;
    }
  },

  /*
   |--------------------------------------------------------------------------
   | VERIFY PAYMENT
   |--------------------------------------------------------------------------
   */

  verifyPayment: async (
    payload: VerifyPaymentPayload
  ) => {
    try {
      const response =
        await paymentApi.verifyPayment(
          payload
        );

      return response;
    } catch (error) {
      const axiosError = error as AxiosError<any>;

      console.error(
        "VERIFY PAYMENT SERVICE ERROR:",
        JSON.stringify(axiosError.response?.data ?? axiosError.message, null, 2),
        "HTTP Status:",
        axiosError.response?.status
      );

      throw error;
    }
  },
};