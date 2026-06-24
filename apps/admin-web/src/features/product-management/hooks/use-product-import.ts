"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  importProducts,
  previewProductImport,
} from "@/infrastructure/api/product-import.api";

import type {
  ImportMode,
  ImportPreviewResponse,
  ImportProductsResponse,
} from "@/features/product-management/types/product-import.type";

export function useProductImport() {

  const queryClient =
    useQueryClient();

  // =====================================
  // PREVIEW
  // =====================================

  const previewMutation =
    useMutation<
      ImportPreviewResponse,
      Error,
      File
    >({
      mutationFn:
        previewProductImport,
    });

  // =====================================
  // IMPORT
  // =====================================

  const importMutation =
    useMutation<
      ImportProductsResponse,
      Error,
      {
        file: File;
        mode: ImportMode;
      }
    >({
      mutationFn:
        ({
          file,
          mode,
        }) =>
          importProducts(
            file,
            mode
          ),

      onSuccess:
        async () => {

          await queryClient.invalidateQueries({
            queryKey: [
              "products",
            ],
          });

          await queryClient.refetchQueries({
            queryKey: [
              "products",
            ],
          });
        },
    });

  return {
    previewMutation,

    importMutation,
  };
}