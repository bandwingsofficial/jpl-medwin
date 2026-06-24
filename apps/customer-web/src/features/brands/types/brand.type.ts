export type BrandStatus = "ACTIVE" | "INACTIVE";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  description?: string;
  metaDescription?: string;
  status: BrandStatus;
  createdAt: string;
  updatedAt: string;
}