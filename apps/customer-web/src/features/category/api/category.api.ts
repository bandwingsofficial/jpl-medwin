import { apiClient } from "@/infrastructure/api/axios-client";
import {
  Category,
  SubCategory,
  CategoryResponse,
} from "../types/category.type";

export const categoryApi = {
  /**
   * 🔹 GET MAIN CATEGORIES
   */
  async getCategories(): Promise<Category[]> {
    const res = await apiClient.get<CategoryResponse>("/categories");
    return res.data.data;
  },

  /**
   * 🔹 GET SUB CATEGORIES
   */
  async getSubCategories(categoryId: string): Promise<SubCategory[]> {
    const res = await apiClient.get<{ data: SubCategory[] }>(
      "/categories/sub",
      {
        params: { categoryId },
      }
    );

    return res.data.data;
  },

  /**
   * 🔥 GET MINI CATEGORIES (FIXED HERE)
   */
  async getMiniCategories(subCategoryId: string) {
  const res = await apiClient.get(
    "/categories/mini",
    {
      params: { subCategoryId },
    }
  );
 // ✅ FINAL CORRECT LINE
  return res.data?.data || [];
},

  /**
   * 🔹 GET CATEGORY TREE
   */
  async getCategoryTree() {
    const res = await apiClient.get("/categories/tree");
    return res.data.data;
  },
};