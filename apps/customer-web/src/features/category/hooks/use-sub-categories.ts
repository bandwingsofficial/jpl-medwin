import { useQuery } from "@tanstack/react-query";

import { categoryApi } from "../api/category.api";

export const useSubCategories = (categorySlug: string) => {
  return useQuery({
    queryKey: ["sub-categories", categorySlug],

    queryFn: async () => {
      return categoryApi.getSubCategories(categorySlug);
    },

    enabled: !!categorySlug,

    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};