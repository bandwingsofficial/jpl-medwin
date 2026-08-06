export interface ProductFilters {
  search?: string;

  categoryId?: string;

  subCategoryId?: string;

  miniCategoryId?: string;

  brandId?: string;

  minPrice?: number;

  maxPrice?: number;

  inStock?: boolean;

  type?: "SIMPLE" | "VARIABLE";

  sortBy?: string;
}