export type SearchResultType =
  | "PRODUCT"
  | "BRAND"
  | "CATEGORY"
  | "SUB_CATEGORY"
  | "MINI_CATEGORY";

export interface SearchResult {
  id: string;
  name: string;
  slug: string;
  type: SearchResultType;
price?: number;
mrp?: number;
  image?: string;
}

export interface GlobalSearchResponse {
  success: boolean;
  message: string;
  data: {
    results: SearchResult[];
  };
}