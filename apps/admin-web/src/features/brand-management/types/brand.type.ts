export type BrandStatus = "ACTIVE" | "INACTIVE";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  description: string;
  metaDescription: string;
  status: BrandStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandPayload {
  name: string;
  image?: File | string;
  description?: string;
  metaDescription?: string;
}

export interface UpdateBrandPayload extends CreateBrandPayload {
  id: string;
}

export interface BrandListResponse {
  success: boolean;
  message: string;
  data: Brand[];
}

export interface BrandSingleResponse {
  success: boolean;
  message: string;
  data: Brand;
}