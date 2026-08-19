"use client";

import {
  ProductCommonFeatures,
} from "./product-common-features";

import {
  ProductCommonHeader,
} from "./product-common-header";

import {
  ProductCommonTechnical,
} from "./product-common-technical";

// =========================================
// TYPES
// =========================================

export interface ProductCategoryDetails {
  id: string;
  name: string;
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface ProductFaq {
  question?: string;
  answer?: string;
}

export interface ProductBrand {
  id?: string;
  name: string;
}

export interface ProductVariantSummary {
  id: string;
  sku: string;
  name: string;
  slug: string;
  status: string;

  pricing?: {
    sellingPrice?: number;
    mrp?: number;
    purchasePrice?: number;
  };

  stock?: {
    quantity?: number;
    inStock?: boolean;
  };

  ratings?: {
    average?: number;
    count?: number;
  };
}

export interface ProductCommonDetailsData {
  id: string;

  name: string;

  slug?: string;

  brand?: ProductBrand | null;

  type?: string;

  currency?: string;

  category?: ProductCategoryDetails | null;

  subCategory?: ProductCategoryDetails | null;

  miniCategory?: ProductCategoryDetails | null;

  categoryId?: string;

  subCategoryId?: string;

  miniCategoryId?: string;

  descriptions?: {
    short?: string;
    long?: string;
  };

  price?: {
    min?: number;
    max?: number;
  };

  stock?: {
    quantity?: number;
    inStock?: boolean;
    isWeighted?: boolean;
  };

  ratings?: {
    average?: number;
    count?: number;
  };

  features?: string[];

  tags?: string[];

  displayNotes?: string[];

  specifications?: ProductSpecification[];

  packing?: string;

  directionOfUse?: string;

  additionalInfo?: string;

  countryOfOrigin?: string;

  faq?: ProductFaq[];

  defaultVariantId?: string;

  createdAt?: string;

  updatedAt?: string;

  variants?: ProductVariantSummary[];
}

// =========================================
// PROPS
// =========================================

interface ProductCommonDetailsProps {
  product: ProductCommonDetailsData;
}

// =========================================
// COMPONENT
// =========================================

export function ProductCommonDetails({
  product,
}: ProductCommonDetailsProps) {
  return (
    <div className="space-y-4">

      {/* ===================================== */}
      {/* 1. HEADER */}
      {/* ===================================== */}

      <ProductCommonHeader
        product={product}
      />

      {/* ===================================== */}
      {/* 2. FEATURES / TAGS / NOTES */}
      {/* ===================================== */}

      <ProductCommonFeatures
        product={product}
      />

      {/* ===================================== */}
      {/* 3. TECHNICAL / FAQ / OTHER */}
      {/* ===================================== */}

      <ProductCommonTechnical
        product={product}
      />

    </div>
  );
}