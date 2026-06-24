import { apiClient } from "@/infrastructure/api/axios-client";

// =========================================
// IMPORT MODE
// =========================================

export type ImportMode =
  | "skip"
  | "override"
  | "restore";

// =========================================
// PREVIEW IMPORT
// =========================================

export async function previewProductImport(
  file: File
) {
  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  const response =
    await apiClient.post(
      "/admin/products/import/preview",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  return response.data;
}

// =========================================
// FINAL IMPORT
// =========================================

export async function importProducts(
  file: File,
  mode: ImportMode
) {
  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  const response =
    await apiClient.post(
      `/admin/products/import?mode=${mode}`,
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  return response.data;
}