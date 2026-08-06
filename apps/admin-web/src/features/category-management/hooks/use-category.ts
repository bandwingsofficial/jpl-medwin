"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "@/infrastructure/api/category.api";
import {
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "../types/category.type";

const CATEGORY_KEY = ["categories"];

// =========================
// GET ALL
// =========================
export function useCategories() {
  return useQuery({
    queryKey: CATEGORY_KEY,
    queryFn: categoryApi.getCategories,
  });
}

// =========================
// CREATE
// =========================
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      categoryApi.createCategory(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEY });
    },

    onError: (error: any) => {
      console.error("Create Category Error:", error);
    },
  });
}

// =========================
// UPDATE (EDIT ONLY)
// =========================
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCategoryPayload;
    }) => categoryApi.updateCategory(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEY });
    },

    onError: (error: any) => {
      console.error("Update Category Error:", error);
    },
  });
}

// =========================
// 🔥 STATUS TOGGLE (NEW)
// =========================
export function useToggleCategoryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "ACTIVE" | "INACTIVE";
    }) => categoryApi.updateCategoryStatus(id, status),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEY });
    },

    onError: (error: any) => {
      console.error("Toggle Status Error:", error);
    },
  });
}

// =========================
// DELETE
// =========================
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryApi.deleteCategory(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEY });
    },

    onError: (error: any) => {
      console.error("Delete Category Error:", error);
    },
  });
}

// =========================
// PREVIEW DELETE
// =========================
export function usePreviewDeleteCategory() {
  return useMutation({
    mutationFn: (id: string) => categoryApi.previewDelete(id),

    onError: (error: any) => {
      console.error("Preview Delete Error:", error);
    },
  });
}

// =========================
// FORCE DELETE
// =========================
export function useForceDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryApi.forceDelete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEY });
    },

    onError: (error: any) => {
      console.error("Force Delete Error:", error);
    },
  });
}