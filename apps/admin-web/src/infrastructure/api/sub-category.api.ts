import { apiClient } from "@/infrastructure/api/axios-client";
import { SubCategory } from "@/features/sub-category-management/types/sub-category.type";

const BASE_URL = "/admin/categories/sub";

export const subCategoryApi = {
  // =========================
  // GET ALL
  // =========================
  async getSubCategories(): Promise<SubCategory[]> {
    try {
      const res = await apiClient.get(BASE_URL);
      return res.data?.data || [];
    } catch (error: any) {
      console.error("GET SubCategories Error:", error);
      throw error?.response?.data || error;
    }
  },

  // =========================
  // CREATE
  // =========================
  async createSubCategory(payload: any): Promise<SubCategory> {
    try {
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
    } catch (error: any) {
      console.error("CREATE SubCategory Error:", error);
      throw error?.response?.data || error;
    }
  },

  // =========================
  // UPDATE (FIELDS / IMAGE)
  // =========================
  async updateSubCategory(id: string, payload: any): Promise<SubCategory> {
    try {
      const hasFile = payload?.image instanceof File;

      // FILE CASE
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

      // JSON CASE
      const res = await apiClient.patch(`${BASE_URL}/${id}`, payload);
      return res.data.data;

    } catch (error: any) {
      console.error("UPDATE SubCategory Error:", error);
      throw error?.response?.data || error;
    }
  },

  // =========================
  // 🔥 STATUS UPDATE (CRITICAL FIX)
  // =========================
  async updateSubCategoryStatus(
    id: string,
    status: "ACTIVE" | "INACTIVE"
  ): Promise<SubCategory> {
    try {
     
      const res = await apiClient.patch(
        `${BASE_URL}/${id}/status`, // ✅ must match backend
        { status }
      );

      return res.data.data;

    } catch (error: any) {
      console.error("STATUS UPDATE Error:", error);
      throw error?.response?.data || error;
    }
  },

  // =========================
  // DELETE (ONLY IF INACTIVE)
  // =========================
  async deleteSubCategory(id: string) {
    try {
      return await apiClient.delete(`${BASE_URL}/${id}`);
    } catch (error: any) {
      console.error("DELETE SubCategory Error:", error);
      throw error?.response?.data || error;
    }
  },
};