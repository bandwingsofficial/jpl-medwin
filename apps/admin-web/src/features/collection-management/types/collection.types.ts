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