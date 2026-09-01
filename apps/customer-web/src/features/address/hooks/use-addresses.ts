"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import axios from "axios";

import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "@/features/address/api/address.api";

// 👉 INTEGRATION: Import platforms toast messaging layer to display clean runtime messages
import { showError, showSuccess } from "@/shared/store/toast.store";

// ========================================
// GET
// ========================================

export function useAddresses() {
  return useQuery({
    queryKey: ["saved-addresses"],

    queryFn: getAddresses,

    staleTime: 1000 * 60 * 5,
  });
}

// ========================================
// CREATE
// ========================================

export function useCreateAddress() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: createAddress,

    onSuccess: () => {
      showSuccess("Address saved successfully");
      queryClient.invalidateQueries({
        queryKey: [
          "saved-addresses",
        ],
      });
    },

    onError: (error) => {
      let message = "Failed to create address";

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const status = error.response?.status;

        // 👉 CHECK: Intercept NestJS bad requests or explicit validation error codes
        if (status === 400 || responseData?.errorCode?.includes("INVALID")) {
          message = "Please fill all necessary fields correctly";
        } else {
          message = responseData?.message || responseData || error.message;
        }
        
        console.error("Create Address Error Detail:", responseData || error.message);
      } else if (error instanceof Error) {
        message = error.message;
        console.error("Create Address Local Error:", error.message);
      }

      showError(message);
    },
  });
}

// ========================================
// UPDATE
// ========================================

export function useUpdateAddress() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: updateAddress,

    onSuccess: () => {
      showSuccess("Address updated successfully");
      queryClient.invalidateQueries({
        queryKey: [
          "saved-addresses",
        ],
      });
    },

    onError: (error) => {
      let message = "Failed to update address";

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const status = error.response?.status;

        // 👉 CHECK: Intercept NestJS bad requests or explicit validation error codes
        if (status === 400 || responseData?.errorCode?.includes("INVALID")) {
          message = "Please fill all necessary fields correctly";
        } else {
          message = responseData?.message || responseData || error.message;
        }

        console.error("Update Address Error Detail:", responseData || error.message);
      } else if (error instanceof Error) {
        message = error.message;
        console.error("Update Address Local Error:", error.message);
      }

      showError(message);
    },
  });
}

// ========================================
// DELETE
// ========================================

export function useDeleteAddress() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: deleteAddress,

    onSuccess: () => {
      showSuccess("Address deleted successfully");
      queryClient.invalidateQueries({
        queryKey: [
          "saved-addresses",
        ],
      });
    },

    onError: (error) => {
      let message = "Failed to delete address";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.response?.data || error.message;
        console.error("Delete Address Error Detail:", error.response?.data || error.message);
      } else if (error instanceof Error) {
        message = error.message;
        console.error("Delete Address Local Error:", error.message);
      }

      showError(message);
    },
  });
}