export type CategoryStatus = "ACTIVE" | "INACTIVE";

export interface SubCategory {
  id: string;

  // RELATION
  categoryId: string;
  categoryName?: string;

  // 🔥 REQUIRED for UI validation
  categoryStatus?: CategoryStatus;

  // BASIC
  name: string;
  slug: string;

  // MEDIA
  imageUrl: string | null;

  // META
  description: string | null;
  metaDescription: string | null;

  // STATE
  status: CategoryStatus;

  // AUDIT
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubCategoryPayload {
  name: string;
  categoryId: string;
  image?: File;

  description?: string;
  metaDescription?: string;
}

export interface UpdateSubCategoryPayload {
  name?: string;
  categoryId?: string;
  image?: File;

  description?: string;
  metaDescription?: string;

  // used by toggle
  status?: CategoryStatus;
}