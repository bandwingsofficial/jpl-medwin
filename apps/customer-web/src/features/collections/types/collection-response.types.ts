import { Collection } from "./collection.types";

export interface CollectionListResponse {
  success: boolean;

  message: string;

  data: {
    data: Collection[];

    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface CollectionDetailResponse {
  collection: Collection;

  products: any[];

  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}