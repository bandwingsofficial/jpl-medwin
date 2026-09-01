"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { subCategoryApi } from "@/infrastructure/api/sub-category.api";

import {
  SubCategory,
  CreateSubCategoryPayload,
  UpdateSubCategoryPayload,
  CategoryStatus,
} from "../types/sub-category.type";
import { showError } from "@/shared/store/toast.store";

const KEY = ["sub-categories"];

// =========================
// GET ALL
// =========================
export function useSubCategories() {
  return useQuery<SubCategory[]>({
    queryKey: KEY,
    queryFn: subCategoryApi.getSubCategories,
  });
}

// =========================
// CREATE
// =========================
export function useCreateSubCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSubCategoryPayload) =>
      subCategoryApi.createSubCategory(payload),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },

    onError: (error: any) => {
      console.error("Create SubCategory Error:", error);
    },
  });
}

// =========================
// UPDATE (FORM)
// =========================
export function useUpdateSubCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateSubCategoryPayload;
    }) => subCategoryApi.updateSubCategory(id, payload),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },

    onError: (error: any) => {
      console.error("Update SubCategory Error:", error);
    },
  });
}

// =========================
// DELETE
// =========================
export function useDeleteSubCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      subCategoryApi.deleteSubCategory(id),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },

    onError: (error: any) => {
      console.error("Delete SubCategory Error:", error);
    },
  });
}

// =========================
// STATUS TOGGLE
// =========================
export function useToggleSubCategoryStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: CategoryStatus;
    }) => subCategoryApi.updateSubCategoryStatus(id, status),

    onSuccess: (_response, variables) => {
      // Immediately update UI
      qc.setQueryData<SubCategory[]>(
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

      // Sync with backend
      void qc.invalidateQueries({
        queryKey: KEY,
      });
    },

    onError: (error) => {
      console.error("❌ Status Toggle Error:", error);

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const response = (
          error as {
            response?: {
              data?: {
                message?: string;
              };
            };
          }
        ).response;

        const message = response?.data?.message;

        if (message) {
          showError(message);
          return;
        }
      }

      showError("Failed to update status");
    },
  });
}