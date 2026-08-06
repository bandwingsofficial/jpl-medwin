import { apiClient } from "@/infrastructure/api/axios-client";

import {
  Order,
  ApiResponse,
  PaymentResponse,
  VerifyPaymentPayload,
} from "../types";

import { OrderListItem } from "../types/order-list.type";
import { CreateOrderPayload } from "../types/create-order.type";

export const ordersApi = {
  /*
   |--------------------------------------------------------------------------
   | GET USER ORDERS
   |--------------------------------------------------------------------------
   | GET /orders
   */
  getMyOrders: async () => {
    const res = await apiClient.get("/orders");

    return (
      res.data?.data?.orders ?? []
    ) as OrderListItem[];
  },

  /*
   |--------------------------------------------------------------------------
   | GET ORDER DETAILS
   |--------------------------------------------------------------------------
   | GET /orders/:orderId
   */
  getOrderDetails: async (
  orderId: string
) => {
  const res =
    await apiClient.get(
      `/orders/${orderId}`
    );
  return res.data;
},

  /*
   |--------------------------------------------------------------------------
   | CREATE ORDER
   |--------------------------------------------------------------------------
   | POST /orders
   */
  createOrder: async (
  payload: CreateOrderPayload
) => {
  const res =
    await apiClient.post(
      "/orders",
      payload
    );

  return res.data;
},

  /*
   |--------------------------------------------------------------------------
   | CREATE PAYMENT
   |--------------------------------------------------------------------------
   | POST /payments/create
   */
  createPayment: async (
    orderId: string
  ) => {
    const res =
      await apiClient.post<
        ApiResponse<PaymentResponse>
      >("/payments/create", {
        orderId,
        provider: "RAZORPAY",
      });

    return res.data.data;
  },

  /*
   |--------------------------------------------------------------------------
   | VERIFY PAYMENT
   |--------------------------------------------------------------------------
   | POST /payments/verify
   */
  verifyPayment: async (
    payload: VerifyPaymentPayload
  ) => {
    const res =
      await apiClient.post<
        ApiResponse<PaymentResponse>
      >("/payments/verify", payload);

    return res.data.data;
  },

  /*
   |--------------------------------------------------------------------------
   | PROCESS ORDER
   |--------------------------------------------------------------------------
   | POST /orders/:id/process
   */
  processOrder: async (
    orderId: string
  ) => {
    const res =
      await apiClient.post<ApiResponse<Order>>(
        `/orders/${orderId}/process`
      );

    return res.data.data;
  },

  /*
   |--------------------------------------------------------------------------
   | SHIP ORDER
   |--------------------------------------------------------------------------
   | POST /orders/:id/ship
   */
  shipOrder: async (
    orderId: string,
    payload: {
      trackingId: string;
      courierName: string;
    }
  ) => {
    const res =
      await apiClient.post<ApiResponse<Order>>(
        `/orders/${orderId}/ship`,
        payload
      );

    return res.data.data;
  },

  /*
   |--------------------------------------------------------------------------
   | REFUND ORDER
   |--------------------------------------------------------------------------
   | POST /orders/:id/refund
   */
  refundOrder: async (
    orderId: string
  ) => {
    const res =
      await apiClient.post<ApiResponse<Order>>(
        `/orders/${orderId}/refund`
      );

    return res.data.data;
  },

  /*
   |--------------------------------------------------------------------------
   | CANCEL ORDER
   |--------------------------------------------------------------------------
   | POST /orders/:id/cancel
   */
  cancelOrder: async (
    orderId: string,
    payload: {
      reason: string;
    }
  ) => {
    const res =
      await apiClient.post<ApiResponse<Order>>(
        `/orders/${orderId}/cancel`,
        payload
      );

    return res.data.data;
  },

  /*
   |--------------------------------------------------------------------------
   | REQUEST RETURN
   |--------------------------------------------------------------------------
   | POST /returns
   */
 requestReturn: async (
  payload: {
    orderId: string;

    type:
      | "REFUND"
      | "REPLACEMENT";

    reason: string;

    description?: string;
  }
) => {
    const res = await apiClient.post(
      "/returns",
      payload
    );

    return res.data;
  },

  /*
   |--------------------------------------------------------------------------
   | GET RETURN DETAILS
   |--------------------------------------------------------------------------
   | GET /returns/:returnId
   |--------------------------------------------------------------------------
   | ONLY IF BACKEND EXISTS
   */
  getReturnDetails: async (
    returnId: string
  ) => {
    const res =
      await apiClient.get(
        `/returns/${returnId}`
      );

    return res.data;
  },

  /*
   |--------------------------------------------------------------------------
   | GET RETURNS FOR ORDER
   |--------------------------------------------------------------------------
   | GET /orders/:orderId/returns
   |--------------------------------------------------------------------------
   | ONLY IF BACKEND EXISTS
   */
  getOrderReturns: async (
    orderId: string
  ) => {
    const res =
      await apiClient.get(
        `/orders/${orderId}/returns`
      );

    return res.data;
  },
};