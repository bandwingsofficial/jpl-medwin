export type CategoryStatus = "ACTIVE" | "INACTIVE";

export interface MiniCategory {
  id: string;

  categoryId: string;
  subCategoryId: string;

  categoryName?: string;
  subCategoryName?: string;

  name: string;
  slug: string;

  imageUrl: string | null;
  description: string | null;
  metaDescription: string | null;

  status: CategoryStatus;

  createdAt: string;
  updatedAt: string;
}

// =========================
// CREATE
// =========================
export interface CreateMiniCategoryPayload {
  name: string;
  categoryId: string;
  subCategoryId: string;

  image?: File;

  description?: string;
  metaDescription?: string;
}

// =========================
// UPDATE
// =========================
export interface UpdateMiniCategoryPayload {
  name?: string;
  categoryId?: string;
  subCategoryId?: string;

  image?: File;

  description?: string;
  metaDescription?: string;

  status?: CategoryStatus;
}