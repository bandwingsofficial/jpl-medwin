export interface ProductImage {
  main: string;

  gallery: string[];
}

export interface ProductPriceRange {
  min: number;

  max: number;
}

export interface ProductRatings {
  average: number;

  count: number;
}

export interface ProductSpecification {
  key: string;

  value: string;
}

export interface ProductFaq {
  question: string;

  answer: string;
}

export interface ProductVariantPricing {
  sellingPrice: number;

  mrp: number;

  purchasePrice: number;
}

export interface ProductVariantStock {
  quantity: number;

  inStock: boolean;
}

export interface ProductVariant {
  id: string;

  productId?: string;

  sku: string;

  name: string;

  slug: string;

  status: string;

  pricing: ProductVariantPricing;

  stock: ProductVariantStock;

  ratings?: ProductRatings;

  attributes: Record<string, string>;

  isWeighted: boolean;

  warrantyMonths: number;

  images: ProductImage;

  createdAt?: string;

  updatedAt?: string;
}

export interface ProductDescriptions {
  short: string;

  long: string;
}

export interface ProductCategory {
  id?: string;

  main?: string;

  sub?: string;

  mini?: string;

  subCategoryId?: string;

  miniCategoryId?: string;
}

export interface ProductBrand {
  id: string;

  name?: string;

  slug?: string;

  image?: string;
}

export interface Product {
  id: string;

  name: string;

  slug: string;

  status: string;

  brand: ProductBrand;

  category: ProductCategory;

  descriptions?: ProductDescriptions;

  price: ProductPriceRange;

  ratings?: ProductRatings;

  images: ProductImage;

  features: string[];

  tags: string[];

  displayNotes: string[];

  specifications: ProductSpecification[];

  packing: string[];

  directionOfUse: string[];

  additionalInfo: string[];

  faq: ProductFaq[];

  defaultVariantId: string;

  variants: ProductVariant[];

  createdAt?: string;

  updatedAt?: string;
}

export interface ProductsPagination {
  total: number;

  page: number;

  limit: number;

  totalPages: number;
}

export interface ProductsResponse {
  data: Product[];

  pagination: ProductsPagination;
}

export interface ProductsApiResponse {
  success: boolean;

  message: string;

  data: {
    data: Product[];

    pagination: ProductsPagination;
  };
}

export interface ProductDetailsApiResponse {
  success: boolean;

  message: string;

  data: Product;
}

export interface ProductVariantsApiResponse {
  success: boolean;

  message: string;

  data: ProductVariant[];
}