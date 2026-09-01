export type CollectionStatus =
  | "ACTIVE"
  | "INACTIVE";

export interface Collection {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  description: string;
  metaDescription: string;
  order: number;
  status: CollectionStatus;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionProduct {
  id: string;
  collectionId: string;
  productId: string;
  createdAt: string;
}