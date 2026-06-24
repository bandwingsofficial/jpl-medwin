"use client";

import { useMutation } from "@tanstack/react-query";

import { ordersApi } from "../api/orders.api";

import { CreateOrderPayload } from "../types/create-order.type";

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (
      payload: CreateOrderPayload
    ) => ordersApi.createOrder(payload),
  });
};