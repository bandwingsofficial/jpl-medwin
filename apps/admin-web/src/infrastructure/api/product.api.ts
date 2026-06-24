import { ProductFilters } from "@/features/product-management/types/product.type";
import { apiClient } from "@/infrastructure/api/axios-client";

// =========================================
// TYPES
// =========================================

export interface DeleteProductPayload {
  productId: string;

  force?: boolean;
}

export interface PreviewDeleteProductPayload {
  productId: string;
}

export interface RestoreProductPayload {
  productId: string;
}

// =========================================
// HELPERS
// =========================================

const buildProductFormData = (
  payload: any
) => {

  const formData =
    new FormData();

  // =========================================
  // EXTRACT FILES
  // =========================================

  const {
    mainImage,
    images,
    variantMainImages,
    variantImages,
    ...jsonPayload
  } = payload;

  // =========================================
  // NORMALIZE
  // =========================================

  const normalizedPayload = {

    ...jsonPayload,

    name: String(
      jsonPayload.name || ""
    ).trim(),

    type: String(
      jsonPayload.type || "SIMPLE"
    ),

    status: String(
      jsonPayload.status || "ACTIVE"
    ),

    categoryId: String(
      jsonPayload.categoryId || ""
    ).trim(),

    subCategoryId: String(
      jsonPayload.subCategoryId || ""
    ).trim(),

    miniCategoryId: String(
      jsonPayload.miniCategoryId || ""
    ).trim(),

    brandId: String(
      jsonPayload.brandId || ""
    ).trim(),

    shortDescription: String(
      jsonPayload.shortDescription || ""
    ).trim(),

    longDescription: String(
      jsonPayload.longDescription || ""
    ).trim(),

    isWeighted:
      jsonPayload.isWeighted === true ||
      jsonPayload.isWeighted === "true",

    warrantyMonths:
      typeof jsonPayload.warrantyMonths ===
      "number"
        ? jsonPayload.warrantyMonths
        : Number(
            jsonPayload.warrantyMonths || 0
          ),

    features:
      Array.isArray(
        jsonPayload.features
      )
        ? jsonPayload.features
        : [],

    tags:
      Array.isArray(
        jsonPayload.tags
      )
        ? jsonPayload.tags
        : [],

    displayNotes:
      Array.isArray(
        jsonPayload.displayNotes
      )
        ? jsonPayload.displayNotes
        : [],

    specifications:
      Array.isArray(
        jsonPayload.specifications
      )
        ? jsonPayload.specifications
        : [],

    packing:
      Array.isArray(
        jsonPayload.packing
      )
        ? jsonPayload.packing
        : [],

    directionOfUse:
      Array.isArray(
        jsonPayload.directionOfUse
      )
        ? jsonPayload.directionOfUse
        : [],

    additionalInfo:
      Array.isArray(
        jsonPayload.additionalInfo
      )
        ? jsonPayload.additionalInfo
        : [],

    faq:
      Array.isArray(
        jsonPayload.faq
      )
        ? jsonPayload.faq
        : [],

    variants:
      Array.isArray(
        jsonPayload.variants
      )
        ? jsonPayload.variants
        : [],
  };

  // =========================================
  // SAFETY CHECK
  // =========================================

  if (
    !normalizedPayload.categoryId ||
    !normalizedPayload.subCategoryId ||
    !normalizedPayload.miniCategoryId ||
    !normalizedPayload.brandId
  ) {

    throw new Error(
      "Category/SubCategory/MiniCategory/Brand missing"
    );
  }

  // =========================================
  // JSON DATA
  // =========================================

  formData.append(
    "data",
    JSON.stringify(
      normalizedPayload
    )
  );

  // =========================================
  // PRODUCT MAIN IMAGE
  // =========================================

  if (
    mainImage &&
    mainImage instanceof File
  ) {

    formData.append(
      "mainImage",
      mainImage
    );
  }

  // =========================================
  // PRODUCT GALLERY
  // =========================================

  if (
    Array.isArray(images)
  ) {

    images.forEach(
      (img: any) => {

        if (
          img instanceof File
        ) {

          formData.append(
            "images",
            img
          );
        }

        else if (
          img?.file instanceof File
        ) {

          formData.append(
            "images",
            img.file
          );
        }
      }
    );
  }

  // =========================================
  // VARIANT MAIN IMAGES
  // =========================================

  if (
    Array.isArray(
      variantMainImages
    )
  ) {

    variantMainImages.forEach(
      (file: File) => {

        if (
          file instanceof File
        ) {

          formData.append(
            "variantMainImages",
            file
          );
        }
      }
    );
  }

  // =========================================
  // VARIANT GALLERY IMAGES
  // =========================================

  if (
    Array.isArray(
      variantImages
    )
  ) {

    variantImages.forEach(
      (file: File) => {

        if (
          file instanceof File
        ) {

          formData.append(
            "variantImages",
            file
          );
        }
      }
    );
  }

  return formData;
};

// =========================================
// PRODUCT API
// =========================================

export const productApi = {

  // =========================================
  // CREATE PRODUCT
  // =========================================

  create: async (
    payload: any
  ) => {

    const formData =
      buildProductFormData(
        payload
      );

    const response =
      await apiClient.post(
        "/admin/products",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  },

  // =========================================
  // UPDATE PRODUCT
  // =========================================

  update: async (
    productId: string,
    payload: any
  ) => {

    const formData =
      buildProductFormData(
        payload
      );

    const response =
      await apiClient.patch(
        `/admin/products/${productId}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  },

 // =========================================
// GET ALL PRODUCTS
// =========================================

getAll: async (
  filters: ProductFilters = {}
) => {
  const response =
    await apiClient.get(
      "/admin/products",
      {
        params: filters,
      }
    );

  return response.data;
},

  // =========================================
  // GET SINGLE PRODUCT
  // =========================================

  getById: async (
    productId: string
  ) => {

    const response =
      await apiClient.get(
        `/admin/products/${productId}`
      );

    return response.data;
  },

  // =========================================
  // GET VARIANTS
  // =========================================

  getVariants: (
    productId: string
  ) =>
    apiClient.get(
      `/admin/products/${productId}/variants`,
      {
        params: {
          includeDeleted: true,
        },
      }
    ),

  // =========================================
  // ADD VARIANT
  // =========================================

  addVariant: (
    productId: string,
    payload: any
  ) =>
    apiClient.post(
      `/admin/products/${productId}/variants`,
      payload
    ),

  // =========================================
  // UPDATE VARIANT
  // =========================================

  updateVariant: (
    productId: string,
    variantId: string,
    payload: any
  ) =>
    apiClient.patch(
      `/admin/products/${productId}/variants/${variantId}`,
      payload
    ),

  // =========================================
  // TOGGLE VARIANT STATUS
  // =========================================

  toggleVariantStatus: (
    productId: string,
    variantId: string,
    status:
      | "ACTIVE"
      | "INACTIVE"
  ) =>
    apiClient.patch(
      `/admin/products/${productId}/variants/${variantId}/status`,
      { status }
    ),

  // =========================================
  // DELETE VARIANT
  // =========================================

  deleteVariant: (
    productId: string,
    variantId: string,
    force?: boolean
  ) =>
    apiClient.delete(
      `/admin/products/${productId}/variants/${variantId}`,
      {
        params: {
          force,
        },
      }
    ),

  // =========================================
  // PREVIEW DELETE VARIANT
  // =========================================

  previewDeleteVariant: (
    productId: string,
    variantId: string
  ) =>
    apiClient.delete(
      `/admin/products/${productId}/variants/${variantId}`,
      {
        params: {
          preview: true,
        },
      }
    ),

  // =========================================
  // RESTORE VARIANT
  // =========================================

  restoreVariant: (
    productId: string,
    variantId: string
  ) =>
    apiClient.patch(
      `/admin/products/${productId}/variants/${variantId}/restore`
    ),

  // =========================================
  // TOGGLE PRODUCT STATUS
  // =========================================

  toggleProductStatus: (
    productId: string,
    status:
      | "ACTIVE"
      | "INACTIVE",
    force?: boolean
  ) =>
    apiClient.patch(
      `/admin/products/${productId}/status`,
      {
        status,
        force,
      }
    ),

  // =========================================
  // DELETE PRODUCT
  // =========================================

  deleteProduct: (
    payload: DeleteProductPayload
  ) => {

    const {
      productId,
      force = false,
    } = payload;

    return apiClient.delete(
      `/admin/products/${productId}`,
      {
        params: {
          force,
        },
      }
    );
  },

  // =========================================
  // PREVIEW DELETE PRODUCT
  // =========================================

  previewDeleteProduct: (
    payload: PreviewDeleteProductPayload
  ) => {

    const {
      productId,
    } = payload;

    return apiClient.delete(
      `/admin/products/${productId}`,
      {
        params: {
          preview: true,
        },
      }
    );
  },

  // =========================================
  // RESTORE PRODUCT
  // =========================================

  restoreProduct: (
    payload: RestoreProductPayload
  ) => {

    const {
      productId,
    } = payload;

    return apiClient.patch(
      `/admin/products/${productId}/restore`
    );
  },
  // =========================================
// EXPORT PRODUCTS
// =========================================

exportProducts: async () => {
  const response = await apiClient.get(
    "/admin/products/export",
    {
      responseType: "blob",
    }
  );

  return response;
},
};