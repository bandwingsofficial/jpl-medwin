"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { AxiosError } from "axios";

import { productApi } from "@/infrastructure/api/product.api";

import {
  CreateProductPayload,
  Product,
  ProductFilters,
  ProductVariant,
} from "@/features/product-management/types/product.type";

// =========================================
// RESPONSE TYPES
// =========================================

interface PaginationMeta {
  total: number;

  page: number;

  limit: number;

  totalPages: number;
}

interface ProductListResponse {
  success: boolean;

  message: string;

  data: Product[];

  pagination?: PaginationMeta;
}

interface SingleProductResponse {
  success: boolean;

  message: string;

  data: Product;
}

interface VariantListResponse {
  success: boolean;

  message: string;

  data: ProductVariant[];

  pagination?: PaginationMeta;
}

// =========================================
// QUERY KEYS
// =========================================

export const PRODUCT_KEYS = {
  all: ["products"] as const,

  detail: (
    productId: string
  ) =>
    [
      "products",
      productId,
    ] as const,

  variants: (
    productId: string
  ) =>
    [
      "products",
      productId,
      "variants",
    ] as const,
};



// =========================================
// HOOK
// =========================================
export const useProduct = (
  filters: ProductFilters = {}
)=> {

  const qc =
    useQueryClient();

  // =========================================
  // GET PRODUCTS
  // =========================================

 const productsQuery =
  useQuery<ProductListResponse>({
    queryKey: [
      ...PRODUCT_KEYS.all,
      filters,
    ],

    queryFn:
      async () => {
        const res =
          await productApi.getAll(
            filters
          );

        return res.data;
      },

    staleTime:
      1000 * 60 * 5,

    gcTime:
      1000 * 60 * 10,

    retry: 2,

    refetchOnWindowFocus:
      false,


      // 🔥 FIX: Intercept response to cleanly sort nested dashboard data alphabetically by product name
      select: (response) => {
        if (!response || !response.data || !Array.isArray(response.data)) {
          return response;
        }
        return {
          ...response,
          data: [...response.data].sort((a, b) =>
            (a.name || "").localeCompare(b.name || "")
          ),
        };
      },
    });

  // =========================================
  // GET SINGLE PRODUCT
  // =========================================

  const useProductById = (
    productId?: string
  ) =>
    useQuery<SingleProductResponse>({
      queryKey:
        PRODUCT_KEYS.detail(
          productId || ""
        ),

      queryFn:
        async () => {

          const res =
            await productApi.getById(
              productId || ""
            );

          return res.data;
        },

      enabled:
        !!productId,

      staleTime:
        1000 * 60 * 5,

      gcTime:
        1000 * 60 * 10,

      retry: 2,

      refetchOnWindowFocus:
        false,
    });

  // =========================================
  // CREATE PRODUCT
  // =========================================

  const createProduct =
    useMutation({
      mutationFn:
        async (
          payload:
            CreateProductPayload
        ) => {

          const res =
            await productApi.create(
              payload
            );

          return res.data;
        },

      onSuccess: async () => {

        await qc.invalidateQueries({
          queryKey:
            PRODUCT_KEYS.all,
        });
      },

      onError: (
        err: AxiosError<any>
      ) => {

        const message =
          err.response?.data
            ?.message ||
          "Failed to create product";

        console.error(
          "❌ CREATE PRODUCT ERROR:",
          message
        );
      },
    });

  // =========================================
  // UPDATE PRODUCT
  // =========================================

  const updateProduct =
    useMutation({
      mutationFn:
        async ({
          productId,
          payload,
          }: {
          productId: string;
          payload: any;
        }) => {

          const res =
            await productApi.update(
              productId,
              payload
            );

          return res.data;
        },

      onSuccess: async (
        _,
        variables
      ) => {

        await qc.invalidateQueries({
          queryKey:
            PRODUCT_KEYS.all,
        });

        await qc.invalidateQueries({
          queryKey:
            PRODUCT_KEYS.detail(
              variables.productId
            ),
        });

        await qc.invalidateQueries({
          queryKey:
            PRODUCT_KEYS.variants(
              variables.productId
            ),
        });
      },

      onError: (
        err: AxiosError<any>
      ) => {

        const message =
          err.response?.data
            ?.message ||
          "Failed to update product";

        console.error(
          "❌ UPDATE PRODUCT ERROR:",
          message
        );
      },
    });

  // =========================================
  // GET VARIANTS
  // =========================================

  const useVariants = (
    productId: string
  ) =>
    useQuery<
      VariantListResponse
    >({
      queryKey:
        PRODUCT_KEYS.variants(
          productId
        ),

      queryFn:
        async () => {

          const res =
            await productApi.getVariants(
              productId
            );

          return res.data;
        },

      enabled:
        !!productId,

      staleTime:
        1000 * 60 * 5,

      gcTime:
        1000 * 60 * 10,

      retry: 2,

      refetchOnWindowFocus:
        false,
    });

  // =========================================
  // ADD VARIANT
  // =========================================

  const addVariant =
    useMutation({
      mutationFn:
        async ({
          productId,
          payload,
          }: {
          productId: string;
          payload: Partial<ProductVariant>;
        }) => {

          const res =
            await productApi.addVariant(
              productId,
              payload
            );

          return res.data;
        },

      onSuccess: async (
        _,
        variables
      ) => {

        await qc.invalidateQueries({
          queryKey:
            PRODUCT_KEYS.variants(
              variables.productId
            ),
        });

        await qc.invalidateQueries({
          queryKey:
            PRODUCT_KEYS.all,
        });
      },
    });

  // =========================================
  // UPDATE VARIANT
  // =========================================

  const updateVariant =
    useMutation({
      mutationFn:
        async ({
          productId,
          variantId,
          payload,
          }: {
          productId: string;
          variantId: string;
          payload: Partial<ProductVariant>;
        }) => {

          const res =
            await productApi.updateVariant(
              productId,
              variantId,
              payload
            );

          return res.data;
        },

      onSuccess: async (
        _,
        variables
      ) => {

        await qc.invalidateQueries({
          queryKey:
            PRODUCT_KEYS.variants(
              variables.productId
            ),
        });

        await qc.invalidateQueries({
          queryKey:
            PRODUCT_KEYS.detail(
              variables.productId
            ),
        });

        await qc.invalidateQueries({
          queryKey:
            PRODUCT_KEYS.all,
        });
      },
    });

  // =========================================
  // TOGGLE VARIANT STATUS
  // =========================================

  const toggleVariantStatus =
    useMutation({
      mutationFn:
        async ({
          productId,
          variantId,
          status,
          }: {
          productId: string;
          variantId: string;
          status:
            | "ACTIVE"
            | "INACTIVE";
        }) => {

          const res =
            await productApi.toggleVariantStatus(
              productId,
              variantId,
              status
            );

          return res.data;
        },

      onSuccess: async (
        _,
        variables
      ) => {

        await qc.invalidateQueries({
          queryKey:
            PRODUCT_KEYS.variants(
              variables.productId
            ),
        });

        await qc.invalidateQueries({
          queryKey:
            PRODUCT_KEYS.detail(
              variables.productId
            ),
        });

        await qc.invalidateQueries({
          queryKey:
            PRODUCT_KEYS.all,
        });
      },
    });

  // =========================================
  // DELETE VARIANT
  // =========================================

  const deleteVariant =
    useMutation({
      mutationFn:
        async ({
          productId,
          variantId,
          force,
          }: {
          productId: string;
          variantId: string;
          force?: boolean;
        }) => {

          const res =
            await productApi.deleteVariant(
              productId,
              variantId,
              force
            );

          return res.data;
        },

      onSuccess: async (
        _,
        variables
      ) => {

        await qc.invalidateQueries({
          queryKey:
            PRODUCT_KEYS.variants(
              variables.productId
            ),
        });

        await qc.invalidateQueries({
          queryKey:
            PRODUCT_KEYS.detail(
              variables.productId
            ),
        });

        await qc.invalidateQueries({
          queryKey:
            PRODUCT_KEYS.all,
        });
      },

      onError: (
        err: AxiosError<any>
      ) => {

        console.error(
          "❌ DELETE VARIANT ERROR:",
          err.response?.data
        );
      },
    });

  // =========================================
  // PREVIEW DELETE PRODUCT
  // =========================================

  const previewDeleteProduct =
    useMutation({
      mutationFn:
        async ({
          productId,
          }: {
          productId: string;
        }) => {

          const res =
            await productApi.previewDeleteProduct(
              {
                productId,
              }
            );

          return res.data;
        },

      onError: (
        err: AxiosError<any>
      ) => {

        console.error(
          "❌ PREVIEW PRODUCT DELETE ERROR:",
          err.response?.data
        );
      },
    });

  // =========================================
  // TOGGLE PRODUCT STATUS
  // =========================================

  const toggleProductStatus =
    useMutation({
      mutationFn:
        async ({
          productId,
          status,
          force,
          }: {
          productId: string;
          status:
            | "ACTIVE"
            | "INACTIVE";
          force?: boolean;
        }) => {

          const res =
            await productApi.toggleProductStatus(
              productId,
              status,
              force
            );

          return res.data;
        },

      onSuccess: async (
        _,
        variables
      ) => {

        await qc.invalidateQueries({
          queryKey:
            PRODUCT_KEYS.all,
        });

        await qc.invalidateQueries({
          queryKey:
            PRODUCT_KEYS.detail(
              variables.productId
            ),
        });
      },

      onError: (
        err: AxiosError<any>
      ) => {

        console.error(
          "❌ TOGGLE PRODUCT STATUS ERROR:",
          err.response?.data
        );
      },
    });

  // =========================================
  // DELETE PRODUCT
  // =========================================

  const deleteProduct =
    useMutation({
      mutationFn:
        async ({
          productId,
          force,
          }: {
          productId: string;
          force?: boolean;
        }) => {

          const res =
            await productApi.deleteProduct(
              {
                productId,
                force,
              }
            );

          return res.data;
        },

      onSuccess: async () => {

        await qc.invalidateQueries({
          queryKey:
            PRODUCT_KEYS.all,
        });
      },

      onError: (
        err: AxiosError<any>
      ) => {

        console.error(
          "❌ DELETE PRODUCT ERROR:",
          err.response?.data
        );
      },
    });

  // =========================================
  // RESTORE PRODUCT
  // =========================================

  const restoreProduct =
    useMutation({
      mutationFn:
        async ({
          productId,
          }: {
          productId: string;
        }) => {

          const res =
            await productApi.restoreProduct(
              {
                productId,
              }
            );

          return res.data;
        },

      onSuccess: async () => {

        await qc.invalidateQueries({
          queryKey:
            PRODUCT_KEYS.all,
        });
      },

      onError: (
        err: AxiosError<any>
      ) => {

        console.error(
          "❌ RESTORE PRODUCT ERROR:",
          err.response?.data
        );
      },
    });

  // =========================================
  // RESTORE VARIANT
  // =========================================

  const restoreVariant =
    useMutation({
      mutationFn:
        async ({
          productId,
          variantId,
          }: {
          productId: string;
          variantId: string;
        }) => {

          const res =
            await productApi.restoreVariant(
              productId,
              variantId
            );

          return res.data;
        },

      onSuccess: async (
        _,
        variables
      ) => {

        await qc.invalidateQueries({
          queryKey:
            PRODUCT_KEYS.variants(
              variables.productId
            ),
        });

        await qc.invalidateQueries({
          queryKey:
            PRODUCT_KEYS.detail(
              variables.productId
            ),
        });

        await qc.invalidateQueries({
          queryKey:
            PRODUCT_KEYS.all,
        });
      },
    });

  return {
    productsQuery,

    useProductById,

    createProduct,

    updateProduct,

    useVariants,

    addVariant,

    updateVariant,

    toggleVariantStatus,

    deleteVariant,

    restoreVariant,

    toggleProductStatus,

    deleteProduct,

    previewDeleteProduct,

    restoreProduct,
  };
};