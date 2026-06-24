import { apiClient } from "@/infrastructure/api/axios-client";
import {
  Category,
  CategoryListResponse,
  CategorySingleResponse,
} from "@/features/category-management/types/category.type";

const BASE_URL = "/admin/categories";

export const categoryApi = {
  // =========================
  // GET
  // =========================
  async getCategories(): Promise<Category[]> {
    try {
      const res = await apiClient.get<CategoryListResponse>(BASE_URL);
      return res.data.data;
    } catch (error: any) {
      throw error?.response?.data || error;
    }
  },

  // =========================
  // CREATE (FORM DATA)
  // =========================
  async createCategory(payload: any): Promise<Category> {
    try {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });

      const res = await apiClient.post<CategorySingleResponse>(
        BASE_URL,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return res.data.data;
    } catch (error: any) {
      throw error?.response?.data || error;
    }
  },

  // =========================
  // UPDATE (SMART HANDLING)
  // =========================
  async updateCategory(id: string, payload: any): Promise<Category> {
    try {
      const hasFile = payload?.image instanceof File;

      if (hasFile) {
        const formData = new FormData();

        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value as any);
          }
        });

        const res = await apiClient.patch<CategorySingleResponse>(
          `${BASE_URL}/${id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        return res.data.data;
      }

      const res = await apiClient.patch<CategorySingleResponse>(
        `${BASE_URL}/${id}`,
        payload
      );

      return res.data.data;

    } catch (error: any) {
      throw error?.response?.data || error;
    }
  },

  // =========================
  // 🔥 STATUS UPDATE (NEW)
  // =========================
  async updateCategoryStatus(
    id: string,
    status: "ACTIVE" | "INACTIVE"
  ): Promise<Category> {
    try {
      const res = await apiClient.patch<CategorySingleResponse>(
        `${BASE_URL}/${id}/status`,
        { status }
      );

      return res.data.data;
    } catch (error: any) {
      throw error?.response?.data || error;
    }
  },

  // =========================
  // DELETE
  // =========================
  async deleteCategory(id: string) {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },

  // =========================
  // PREVIEW DELETE
  // =========================
  async previewDelete(id: string) {
    const res = await apiClient.get(`${BASE_URL}/${id}?preview=true`);
    return res.data.data;
  },

  // =========================
  // FORCE DELETE
  // =========================
  async forceDelete(id: string) {
    return apiClient.delete(`${BASE_URL}/${id}?force=true`);
  },
};