import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "../api/category.api";

export const useSubCategories = (categoryId: string) => {
  return useQuery({
    queryKey: ["sub-categories", categoryId],

    queryFn: async () => {
      return categoryApi.getSubCategories(categoryId);
    },

    enabled: !!categoryId, // prevents undefined calls

    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};