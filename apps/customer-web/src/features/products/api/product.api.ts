import { apiClient } from "@/infrastructure/api/axios-client";

import {
  Product,
  ProductVariant,
  ProductsApiResponse,
} from "@/features/products/types/product.type";

interface GetProductsParams {
  page?: number;

  limit?: number;

  search?: string;

  categoryId?: string;

  subCategoryId?: string;

  miniCategoryId?: string;

  brandId?: string;

  minPrice?: number;

  maxPrice?: number;

  inStock?: boolean;

  type?: "SIMPLE" | "VARIABLE";

  sortBy?: string;

  sortOrder?: "asc" | "desc";
}

interface ProductDetailsApiResponse {
  success: boolean;

  message: string;

  data: Product;
}

interface ProductVariantsApiResponse {
  success: boolean;

  message: string;

  data: ProductVariant[];
}

export const productApi = {
  /*
   |--------------------------------------------------------------------------
   | GET PRODUCTS
   |--------------------------------------------------------------------------
   */

  async getProducts(
    params?: GetProductsParams
  ): Promise<ProductsApiResponse> {
    const response =
      await apiClient.get(
        "/products",
        {
          params,
        }
      );

    return response.data;
  },

  /*
   |--------------------------------------------------------------------------
   | GET PRODUCT DETAILS
   |--------------------------------------------------------------------------
   */

  async getProductBySlug(
    slug: string
  ): Promise<ProductDetailsApiResponse> {
    const response =
      await apiClient.get(
        `/products/${slug}`
      );

    return response.data;
  },

  /*
   |--------------------------------------------------------------------------
   | GET PRODUCT VARIANTS
   |--------------------------------------------------------------------------
   */

  async getProductVariants(
    slug: string
  ): Promise<ProductVariantsApiResponse> {
    const response =
      await apiClient.get(
        `/products/${slug}/variants`
      );

    return response.data;
  },
};