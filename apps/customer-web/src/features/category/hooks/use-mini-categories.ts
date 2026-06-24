import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "../api/category.api";

export const useMiniCategories = (subCategoryId?: string) => {
  return useQuery({
    queryKey: ["mini-categories", subCategoryId],

    queryFn: async () => {
      if (!subCategoryId) return [];

      const data = await categoryApi.getMiniCategories(subCategoryId);

      return data || []; // ✅ force fallback
    },

    enabled: !!subCategoryId,
  });
};