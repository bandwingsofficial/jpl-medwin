export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  description: string | null;
  metaDescription: string | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
  categoryId: string;
  categoryName: string;
}