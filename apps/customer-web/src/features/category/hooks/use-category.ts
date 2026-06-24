"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "../api/category.api";
import { Category } from "../types/category.type";

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["customer-categories"],
    queryFn: categoryApi.getCategories,
    staleTime: 1000 * 60 * 5,
    // 🔥 The select function intercept sorts the categories array alphabetically before returning it to the UI
    select: (data) => {
      if (!data || !Array.isArray(data)) return [];
      return [...data].sort((a, b) => a.name.localeCompare(b.name));
    },
  });
};