export type ProductStatus =
  | "ACTIVE"
  | "INACTIVE";

export type ProductType =
  | "SIMPLE"
  | "VARIABLE";

export type CustomerType =
  | "DOCTOR"
  | "HOSPITAL";

// =========================================
// FAQ
// =========================================

export interface FAQ {
  question: string;
  answer: string;
}

// =========================================
// SPECIFICATIONS
// =========================================

export interface Specification {
  key: string;
  value: string;
}

// =========================================
// PRODUCT IMAGE
// =========================================

export interface ProductImage {
  id?: string;

  url?: string;

  isDeleted?: boolean;

  isNew?: boolean;

  file?: File;
}

// =========================================
// PRODUCT VARIANT
// =========================================

export interface ProductVariant {
  id?: string;

  sku: string;

  name: string;

  purchasePrice: number;

  sellingPrice: number;

  mrp: number;

  quantity: number;

  averageRating?: number;

  reviewCount?: number;

  isWeighted?: boolean;

  warrantyMonths?: number | null;

  attributes: Record<string, any>;

  images?: ProductImage[];

  mainImage?: string;

  existingMainImage?: string;

  newMainImage?: File | null;

  newGalleryImages?: File[];

  mainFile?: File | null;
}

// =========================================
// CREATE PRODUCT PAYLOAD
// =========================================

export interface CreateProductPayload {
  name: string;

  type: ProductType;

  customerType: CustomerType;

  categoryId: string;

  subCategoryId: string;

  miniCategoryId: string;

  brandId: string;

  hsnCode?: string;

  shortDescription: string;

  longDescription: string;

  features: string[];

  tags: string[];

  displayNotes: string[];

  specifications: Specification[];

  packing: string[];

  directionOfUse: string[];

  additionalInfo: string[];

  faq: FAQ[];

  isWeighted: boolean;

  isOverweight: boolean;

  weightKg?: number | null;

  warrantyMonths?: number;

  isReturnable?: boolean;

  hasCatalogue?: boolean;

  catalogueFile?: File | null;

  catalogueFileName?: string | null;

  catalogueFileUrl?: string | null;

  catalogueFileType?: string | null;

  catalogueFileSize?: number | null;

  status?: ProductStatus;

  // =====================================
  // PRODUCT IMAGES
  // =====================================

  mainImage: File | null;

  images: ProductImage[];

  // =====================================
  // VARIANTS
  // =====================================

  variants: ProductVariant[];

  // =====================================
  // BACKEND MAPPING SUPPORT
  // =====================================

  variantMainImages: File[];

  variantImages: File[];
}

// =========================================
// PRODUCT PRICE
// =========================================

export interface ProductPrice {
  min: number;
  max: number;
}

// =========================================
// PRODUCT RATINGS
// =========================================

export interface ProductRatings {
  average: number;
  count: number;
}

// =========================================
// PRODUCT VARIANT RESPONSE
// =========================================

export interface ProductVariantResponse {
  id: string;

  name: string;

  slug: string;

  sku: string;

  status: ProductStatus;

  pricing: {
    sellingPrice: number;
    mrp: number;
    purchasePrice: number;
  };

  stock: {
    quantity: number;
    inStock: boolean;
  };

  attributes: Record<string, any>;

  images: {
    main: string;
    gallery: string[];
  };

  ratings: {
    average: number;
    count: number;
  };

  isWeighted: boolean;

  warrantyMonths: number | null;

  createdAt: string;

  updatedAt: string;

  deletedAt: string | null;
}

// =========================================
// PRODUCT RESPONSE
// =========================================

export interface ProductResponse {
  id: string;

  name: string;

  slug: string;

  type: ProductType;

  customerType: CustomerType;

  status: ProductStatus;

  currency: string;

  brand: {
    id: string;
    name: string;
    slug: string;
  };

  category: {
    id: string;
    name: string;
    slug: string;
  };

  subCategory: {
    id: string;
    name: string;
    slug: string;
  };

  miniCategory: {
    id: string;
    name: string;
    slug: string;
  };

  shortDescription: string | null;

  longDescription: string | null;

  hsnCode: string | null;

  ratings: {
    average: number;
    count: number;
  };

  price: {
    min: number;
    max: number;
  };

  stock: {
    quantity: number;
    inStock: boolean;
  };

  isWeighted: boolean;

  isOverweight: boolean;

  weightKg: number | null;

  warrantyMonths: number | null;

  isReturnable?: boolean;

  hasCatalogue?: boolean;

  catalogueFileName?: string | null;

  catalogueFileUrl?: string | null;

  catalogueFileType?: string | null;

  catalogueFileSize?: number | null;

  images: {
    main: string;
    gallery: string[];
  };

  features: string[];

  tags: string[];

  displayNotes: string[];

  specifications: {
    key: string;
    value: string;
  }[];

  packing: string[];

  directionOfUse: string[];

  additionalInfo: string[];

  faq: {
    question: string;
    answer: string;
  }[];

  defaultVariantId: string;

  createdAt: string;

  updatedAt: string;

  deletedAt: string | null;

  variants: ProductVariantResponse[];
}

// =========================================
// PRODUCT
// =========================================

export interface Product {
  id: string;

  name: string;

  slug: string;

  type: ProductType;

  customerType: CustomerType;

  status: ProductStatus;

  currency: string;

  shortDescription: string | null;

  longDescription: string | null;

  hsnCode: string | null;

  brand: {
    id: string;
    name: string;
    slug: string;
  };

  category: {
    id: string;
    name: string;
    slug: string;
  };

  subCategory: {
    id: string;
    name: string;
    slug: string;
  };

  miniCategory: {
    id: string;
    name: string;
    slug: string;
  };

  ratings: {
    average: number;
    count: number;
  };

  price: {
    min: number;
    max: number;
  };

  stock: {
    quantity: number;
    inStock: boolean;
  };

  isWeighted: boolean;

  isOverweight: boolean;

  weightKg: number | null;

  warrantyMonths: number | null;

  isReturnable?: boolean;

  hasCatalogue?: boolean;

  catalogueFileName?: string | null;

  catalogueFileUrl?: string | null;

  catalogueFileType?: string | null;

  catalogueFileSize?: number | null;

  images: {
    main: string;
    gallery: string[];
  };

  features: string[];

  tags: string[];

  displayNotes: string[];

  specifications: Specification[];

  packing: string[];

  directionOfUse: string[];

  additionalInfo: string[];

  faq: FAQ[];

  defaultVariantId: string;

  createdAt: string;

  updatedAt: string;

  variants: ProductVariantResponse[];
}

// =========================================
// SERVER FILTERS PARAMETERS
// =========================================

export interface ProductFilters {
  // Search
  search?: string;

  // Filters
  categoryId?: string;
  subCategoryId?: string;
  miniCategoryId?: string;
  brandId?: string;

  status?: ProductStatus;
  type?: ProductType;

  // Pagination
  page?: number;
  limit?: number;
}