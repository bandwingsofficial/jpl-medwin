// src/modules/product/application/types/product-import.types.ts

export type ParsedVariant = {
  sku: string;

  name: string;
purchasePrice: number | undefined;
sellingPrice: number | undefined;
mrp: number | undefined;
quantity: number | undefined;

  attributes: Record<string, string>;

  averageRating: number;

  reviewCount: number;

  isWeighted: boolean;

  warrantyMonths: number | null;

  images: {
    main: string | null;

    gallery: string[];
  };
};

export type ParsedProduct = {
  name: string;

  category: string;

  subCategory: string;

  miniCategory: string;

  brand: string;

  customerType: string;

  hsnCode?: string;

type?: 'SIMPLE' | 'VARIABLE';

  shortDescription: string;

  longDescription: string;

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

  isReturnable?: boolean;

  isOverweight?: boolean;

  weightKg?: number | null;

  images: {
    main: string | null;

    gallery: string[];
  };

  variants: ParsedVariant[];
};

export type ProductImportValidationError = {
  row?: number;

  product?: string;

  sku?: string;

  reason: string;
};
