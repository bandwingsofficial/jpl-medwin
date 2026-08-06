import { apiClient } from "@/infrastructure/api/axios-client";
import { MiniCategory } from "@/features/mini-category-management/types/mini-category.type";

const BASE_URL = "/admin/categories/mini";

export const miniCategoryApi = {
  // =========================
  // GET ALL
  // =========================
  async getMiniCategories(): Promise<MiniCategory[]> {
    const res = await apiClient.get(BASE_URL);
    return res.data.data;
  },

  // =========================
  // CREATE
  // =========================
  async createMiniCategory(payload: any): Promise<MiniCategory> {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });

    const res = await apiClient.post(BASE_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.data;
  },

  // =========================
  // UPDATE
  // =========================
  async updateMiniCategory(id: string, payload: any) {
    const hasFile = payload?.image instanceof File;

    if (hasFile) {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });

      const res = await apiClient.patch(`${BASE_URL}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data.data;
    }

    const res = await apiClient.patch(`${BASE_URL}/${id}`, payload);
    return res.data.data;
  },

  // =========================
  // 🔥 STATUS TOGGLE (FIXED HARD)
  // =========================
  async updateMiniCategoryStatus(
    id: string,
    status: "ACTIVE" | "INACTIVE"
  ) {
   
    const res = await apiClient.patch(
      `${BASE_URL}/${id}/status`,
      {
        status: status, // keep explicit
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data.data;
  },

  // =========================
  // DELETE
  // =========================
  async deleteMiniCategory(id: string) {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },
};