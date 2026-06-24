"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { miniCategoryApi } from "@/infrastructure/api/mini-category.api";
import { CategoryStatus } from "../types/mini-category.type";
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

// =========================
// 🔥 STATUS TOGGLE (FINAL FIX)
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
    }) => {
      return miniCategoryApi.updateMiniCategoryStatus(id, status);
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },

    onError: (error: any) => {
      console.error("❌ MINI STATUS ERROR:", error);

      const msg =
        error?.response?.data?.message ||
        "Failed to update status";

      showError(msg);
    },
  });
}