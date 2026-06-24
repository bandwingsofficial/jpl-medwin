"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { AxiosError } from "axios";

import { ordersApi } from "@/features/orders/api/orders.api";

import {
  ReturnRequestPayload,
} from "@/features/orders/types";

import {
  showSuccess,
  showError,
} from "@/shared/store/toast.store";

export const useRequestReturn =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: (
        payload: ReturnRequestPayload
      ) =>
        ordersApi.requestReturn(
          payload
        ),

      /*
      |------------------------------------------------------------------
      | SUCCESS
      |------------------------------------------------------------------
      */

      onSuccess: async (
        data,
        variables
      ) => {
      showSuccess(
          data?.message ??
            "Return request submitted successfully"
        );

        await queryClient.invalidateQueries(
          {
            queryKey: [
              "orders",
            ],
          }
        );

        await queryClient.invalidateQueries(
          {
            queryKey: [
              "orders",
              "details",
              variables.orderId,
            ],
          }
        );
      },

      /*
      |------------------------------------------------------------------
      | ERROR
      |------------------------------------------------------------------
      */

      onError: (
        error:
          AxiosError<any>
      ) => {
        if (
          error.response?.status ===
            409 ||
          error.response?.data
            ?.errorCode ===
            "RETURN_ALREADY_REQUESTED"
        ) {
          showError(
            error.response?.data
              ?.message ??
              "Return request already exists"
          );

          return;
        }

        if (
          error.response?.data
            ?.errorCode ===
          "ORDER.INVALID_OPERATION"
        ) {
          showError(
            error.response?.data
              ?.message ??
              "Only delivered orders can be returned"
          );

          return;
        }

        showError(
          error.response?.data
            ?.message ??
            "Failed to submit return request"
        );

        console.error(
          "RETURN REQUEST ERROR",
          error
        );
      },

      retry: false,
    });
  };