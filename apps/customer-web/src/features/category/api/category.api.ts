import { apiClient } from "@/infrastructure/api/axios-client";
import {
  Category,
  SubCategory,
  MiniCategory,
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
  async getSubCategories(
  categorySlug: string,
): Promise<SubCategory[]> {
  const res = await apiClient.get<{ data: SubCategory[] }>(
    `/categories/${categorySlug}/sub`,
  );

  return res.data.data;
},

async getMiniCategories(
  categorySlug: string,
  subCategorySlug: string,
): Promise<MiniCategory[]> {
  const res = await apiClient.get<{ data: MiniCategory[] }>(
    `/categories/${categorySlug}/sub/${subCategorySlug}/mini`,
  );

  return res.data.data;
},

  /**
   * 🔹 GET CATEGORY TREE
   */
  async getCategoryTree() {
    const res = await apiClient.get("/categories/tree");
    return res.data.data;
  },
};