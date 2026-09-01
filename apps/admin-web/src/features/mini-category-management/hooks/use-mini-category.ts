"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { miniCategoryApi } from "@/infrastructure/api/mini-category.api";
import { CategoryStatus, MiniCategory } from "../types/mini-category.type";
import { showError } from "@/shared/store/toast.store";

const KEY = ["mini-categories"];

// =========================
// GET ALL
// =========================
export function useMiniCategories() {
  return useQuery({
    queryKey: KEY,
    queryFn: miniCategoryApi.getMiniCategories,
  });
}

// =========================
// CREATE
// =========================
export function useCreateMiniCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: miniCategoryApi.createMiniCategory,

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },

    onError: (error: any) => {
      console.error("Create Mini Category Error:", error);
      showError(error?.response?.data?.message || "Create failed");
    },
  });
}

// =========================
// UPDATE
// =========================
export function useUpdateMiniCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: any;
    }) => miniCategoryApi.updateMiniCategory(id, payload),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },

    onError: (error: any) => {
      console.error("Update Mini Category Error:", error);
      showError(error?.response?.data?.message || "Update failed");
    },
  });
}

// =========================
// DELETE
// =========================
export function useDeleteMiniCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      miniCategoryApi.deleteMiniCategory(id),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },

    onError: (error: any) => {
      console.error("Delete Mini Category Error:", error);
      showError(error?.response?.data?.message || "Delete failed");
    },
  });
}

/// =========================
// STATUS TOGGLE
// =========================
export function useToggleMiniCategoryStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: CategoryStatus;
    }) => miniCategoryApi.updateMiniCategoryStatus(id, status),

    onSuccess: (_response, variables) => {
      // Immediately update React Query cache
      qc.setQueryData<MiniCategory[]>(
        KEY,
        (currentData) => {
          if (!currentData) {
            return currentData;
          }

          return currentData.map((item) =>
            item.id === variables.id
              ? {
                  ...item,
                  status: variables.status,
                }
              : item
          );
        }
      );

      // Revalidate with backend
      void qc.invalidateQueries({
        queryKey: KEY,
      });
    },

    onError: (error) => {
      console.error("❌ MINI STATUS ERROR:", error);

      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error
          ? (
              error as {
                response?: {
                  data?: {
                    message?: string;
                  };
                };
              }
            ).response?.data?.message
          : undefined;

      showError(message ?? "Failed to update status");
    },
  });
}