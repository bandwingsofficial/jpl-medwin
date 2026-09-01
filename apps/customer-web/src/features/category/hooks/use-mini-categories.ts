import { useQuery } from "@tanstack/react-query";

import { categoryApi } from "../api/category.api";

export const useMiniCategories = (
  categorySlug?: string,
  subCategorySlug?: string,
) => {
  return useQuery({
    queryKey: [
      "mini-categories",
      categorySlug,
      subCategorySlug,
    ],

    queryFn: async () => {
      if (!categorySlug || !subCategorySlug) {
        return [];
      }

      const data = await categoryApi.getMiniCategories(
        categorySlug,
        subCategorySlug,
      );

      return data || [];
    },

    enabled: !!categorySlug && !!subCategorySlug,
  });
};