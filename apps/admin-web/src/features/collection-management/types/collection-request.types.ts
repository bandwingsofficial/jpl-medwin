export interface CreateCollectionRequest {
  name: string;
  image?: File;
  description?: string;
  metaDescription?: string;
  order?: number;
}

export interface UpdateCollectionRequest {
  name?: string;
  image?: File;
  description?: string;
  metaDescription?: string;
  order?: number;
}

export interface AssignProductRequest {
  productId: string;
}