import {
  Collection,
} from "./collection.types";

import {
  CollectionDetailProduct,
} from "./collection-product.types";

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

export interface CollectionSingleResponse {
  success: boolean;
  message: string;
  data: Collection;
}

export interface CollectionDetailsResponse {
  success: boolean;
  message: string;
  data: {
    collection: Collection;
    products: CollectionDetailProduct[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface CollectionDeleteResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
  };
}