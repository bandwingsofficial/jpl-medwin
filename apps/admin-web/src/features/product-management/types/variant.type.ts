export type VariantStatus =
  | "ACTIVE"
  | "INACTIVE";

export interface VariantPricing {
  sellingPrice: number;

  mrp: number;

  purchasePrice: number;
}

export interface VariantStock {
  quantity: number;

  inStock: boolean;
}

export interface VariantRatings {
  average: number;

  count: number;
}

export interface VariantImages {
  main: string | null;

  gallery: string[];
}

export interface VariantAttributes {
  [key: string]: string;
}

export interface ProductVariant {
  id: string;

  productId: string;

  sku: string;

  name: string;

  slug: string;

  status: VariantStatus;

  // =========================================
  // SOFT DELETE
  // =========================================

  deletedAt?: string | null;

  pricing: VariantPricing;

  stock: VariantStock;

  ratings: VariantRatings;

  attributes: VariantAttributes;

  isWeighted: boolean;

  warrantyMonths: number | null;

  images: VariantImages;

  createdAt: string;

  updatedAt: string;
}

export interface VariantPagination {
  total: number;

  page: number;

  limit: number;

  totalPages: number;
}

export interface VariantListResponse {

    success:boolean;

    message:string;

    data:{
        variants:ProductVariant[];
        pagination:VariantPagination;
    };
}