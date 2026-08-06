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
    }) => {
     return subCategoryApi.updateSubCategoryStatus(id, status);
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },

    onError: (error: any) => {
      console.error("❌ Status Toggle Error:", error);

      // 🔥 USER FRIENDLY ERROR
      if (error?.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError("Failed to update status");
      }
    },
  });
}