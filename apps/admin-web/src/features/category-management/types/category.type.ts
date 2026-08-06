export type CategoryStatus = "ACTIVE" | "INACTIVE";

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  description: string | null;
  metaDescription: string | null;
  status: CategoryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug?: string;
  image?: File; // 🔥 FIXED (S3 upload)
  description?: string;
  metaDescription?: string;
  status?: CategoryStatus; // ✅ ADDED
}

export interface UpdateCategoryPayload {
  name?: string;
  slug?: string;
  image?: File;
  description?: string;
  metaDescription?: string;
  status?: "ACTIVE" | "INACTIVE"; // ✅ ADD THIS // ✅ ADDED
}

export interface CategoryListResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export interface CategorySingleResponse {
  success: boolean;
  message: string;
  data: Category;
}

export interface CategoryErrorResponse {
  success: false;
  message: string;
  errorCode: string;
  details?: Record<string, any>;
}