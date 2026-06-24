export type BannerType =
  | "HOME_BANNER"
  | "CATEGORY_BANNER"
  | "SUB_CATEGORY_BANNER"
  | "PROMOTIONAL_BANNER"
  | "PRODUCT_BANNER";

export type BannerStatus =
  | "ACTIVE"
  | "INACTIVE";

export type BannerImageLayout =
  | "HERO"
  | "HORIZONTAL"
  | "VERTICAL";

export interface BannerDimensionRule {
  width: number;

  height: number;

  tolerance: number;

  maxFileSizeMB: number;

  acceptedFormats: string[];
}

export interface BannerImage {
  id: string;

  bannerId: string;

  imageUrl: string;

  productId: string;

  sortOrder: number;

  createdAt: string;

  updatedAt: string;
}

export interface Banner {
  id: string;

  name: string;

  type: BannerType;

  status: BannerStatus;

  images?: BannerImage[];

  createdAt: string;

  updatedAt: string;
}

export interface CreateBannerImageInput {
  file: File;

  productId: string;

  sortOrder: number;
}

export interface CreateBannerRequest {
  name: string;

  type: BannerType;

  images: CreateBannerImageInput[];
}

export interface UpdateBannerRequest {
  name: string;

  type: BannerType;
}

export interface UpdateBannerImageRequest {
  image?: File;

  productId?: string;

  sortOrder?: number;
}

export interface ImageValidationResult {
  valid: boolean;

  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;

  message: string;

  data: T;
}