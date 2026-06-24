export interface ProductFilters {
  search?: string;

  status?: "ACTIVE" | "INACTIVE";

  type?: "SIMPLE" | "VARIABLE";

  categoryId?: string;

  subCategoryId?: string;

  miniCategoryId?: string;

  brandId?: string;

  minPrice?: number;

  maxPrice?: number;

  inStock?: boolean;

  sortBy?: string;

  page?: number;

  limit?: number;
}