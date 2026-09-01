export type ImportMode =
  | "skip"
  | "override"
  | "restore";

// =========================================
// VALIDATION
// =========================================

export interface ImportValidationError {
  row: number;

  field: string;

  message: string;
}

export interface ImportValidation {
  valid: boolean;

  totalErrors: number;

  errors: ImportValidationError[];
}

// =========================================
// PREVIEW SUMMARY
// =========================================

export interface ImportSummary {
  totalRows: number;

  totalProducts: number;

  totalVariants: number;

  simpleProducts: number;

  variableProducts: number;

  totalErrors: number;
}

// =========================================
// PRODUCT PREVIEW
// =========================================

export interface PreviewSpecification {
  key: string;

  value: string;
}

export interface PreviewFaq {
  question: string;

  answer: string;
}

export interface PreviewImages {
  main: string;

  gallery: string[];
}

export interface PreviewVariant {
  sku: string;

  name: string;

  purchasePrice: number;

  sellingPrice: number;

  mrp: number;

  quantity: number;

  attributes: Record<
    string,
    string
  >;

  averageRating?: number;

  reviewCount?: number;

  isWeighted?: boolean;

  warrantyMonths?: number;

  images: PreviewImages;
}

export interface PreviewProduct {
  name: string;

  category: string;

  subCategory: string;

  miniCategory: string;

  brand: string;

  type:
    | "SIMPLE"
    | "VARIABLE";

  shortDescription: string;

  longDescription: string;

  features: string[];

  tags: string[];

  displayNotes: string[];

  specifications: PreviewSpecification[];

  packing: string[];

  directionOfUse: string[];

  additionalInfo: string[];

  faq: PreviewFaq[];

  images: PreviewImages;

  variants: PreviewVariant[];
}

// =========================================
// PREVIEW RESPONSE DATA
// =========================================

export interface ImportPreviewData {
  success: boolean;

  summary: ImportSummary;

  validation: ImportValidation;

  preview: PreviewProduct[];
}

// =========================================
// PREVIEW RESPONSE
// =========================================

export interface ImportPreviewResponse {
  success: boolean;

  message: string;

  data: ImportPreviewData;
}

// =========================================
// FINAL IMPORT
// =========================================

export interface FinalImportSummary {
  totalRows: number;

  totalProducts: number;

  imported: number;

  updated: number;

  restored: number;

  skipped: number;

  failed: number;
}

export interface ImportedProduct {
  id: string;

  product: string;

  variants?: number;
}

export interface UpdatedProduct {
  id: string;

  product: string;
}

export interface RestoredProduct {
  id: string;

  product: string;
}

export interface SkippedProduct {
  id?: string;

  product: string;

  reason?: string;
}

export interface FailedProduct {
  row?: number;

  product?: string;

  reason: string;
}

// =========================================
// FINAL IMPORT DATA
// =========================================

export interface ImportProductsData {
  success: boolean;

  summary: FinalImportSummary;

  imported: ImportedProduct[];

  updated: UpdatedProduct[];

  restored: RestoredProduct[];

  skipped: SkippedProduct[];

  failed: FailedProduct[];
}

// =========================================
// FINAL IMPORT RESPONSE
// =========================================

export interface ImportProductsResponse {
  success: boolean;

  message: string;

  data: ImportProductsData;
}

