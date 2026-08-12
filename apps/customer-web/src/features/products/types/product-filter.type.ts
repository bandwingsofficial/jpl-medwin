export interface ProductFilters {
  search?: string;

 categorySlug?: string;

  subCategorySlug?: string;

  miniCategorySlug?: string;
  
  brandId?: string;

  minPrice?: number;

  maxPrice?: number;

  inStock?: boolean;

  type?: "SIMPLE" | "VARIABLE";

  sortBy?: string;
}