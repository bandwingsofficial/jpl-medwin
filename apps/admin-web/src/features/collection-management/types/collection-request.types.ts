export interface CreateCollectionRequest {
  name: string;
  image?: File;
  description?: string;
  metaDescription?: string;
}

export interface UpdateCollectionRequest {
  name?: string;
  image?: File;
  description?: string;
  metaDescription?: string;
}

export interface AssignProductRequest {
  productId: string;
}