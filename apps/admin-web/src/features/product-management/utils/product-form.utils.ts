import { Product } from "../types/product.type";



export function mapProductToForm(product: Product) {

  return {

    id: product.id,

    name: product.name || "",

    type: product.type || "SIMPLE",

    customerType: product.customerType || "",

    status: product.status || "ACTIVE",

    categoryId: product.category?.id || "",

    subCategoryId: product.subCategory?.id || "",

    miniCategoryId: product.miniCategory?.id || "",

    brandId: product.brand?.id || "",

    hsnCode: product.hsnCode || "",

    mainImage: null,

    existingMainImage: product.images?.main || "",

    images: (product.images?.gallery || []).map((url: string) => ({ url })),

    shortDescription: product.shortDescription || "",

    longDescription: product.longDescription || "",

    features: product.features || [],

    tags: product.tags || [],

    displayNotes: product.displayNotes || [],

    packing: product.packing || [],

    directionOfUse: product.directionOfUse || [],

    additionalInfo: product.additionalInfo || [],

    specifications: product.specifications || [],

    faq: product.faq || [],

    isWeighted: product.isWeighted || false,

    isOverweight: (product as any).isOverweight || false,

    weightKg: (product as any).weightKg || "",

    warrantyMonths: product.warrantyMonths || 0,

    isReturnable: (product as any).isReturnable !== false,

    hasCatalogue: (product as any).hasCatalogue || false,

    catalogueFileName: (product as any).catalogueFileName || "",

    catalogueFileUrl: (product as any).catalogueFileUrl || "",

    catalogueFileType: (product as any).catalogueFileType || "",

    catalogueFileSize: (product as any).catalogueFileSize || null,

    catalogueFile: null,

    previewSku: product.type === "SIMPLE" ? product.variants?.[0]?.sku || "" : "",

    variantSkuPrefix:
      product.type === "VARIABLE" && product.variants?.[0]?.sku
        ? extractProductSkuPrefix(product.variants[0].sku) || ""
        : "",

    variants: (product.variants || []).map((variant: any) => ({

      id: variant.id,

      sku: variant.sku,

      name: variant.name,

      purchasePrice: variant.pricing?.purchasePrice ?? "",

      sellingPrice: variant.pricing?.sellingPrice ?? "",

      mrp: variant.pricing?.mrp ?? "",

      quantity: variant.stock?.quantity ?? "",

      averageRating: variant.ratings?.average || 0,

      reviewCount: variant.ratings?.count || 0,

      isWeighted: variant.isWeighted || false,

      warrantyMonths: variant.warrantyMonths || 0,

      attributes: variant.attributes || {},

      existingMainImage: variant.images?.main || "",

      mainFile: null,

      images: (variant.images?.gallery || []).map((url: string) => ({ url })),

      isDeleted: false,

      isPersisted: true,

    })),

  };

}



export function hasProductBasics(form: any) {

  return Boolean(

    form.name?.trim() &&

      form.customerType?.trim() &&

      form.categoryId?.trim() &&

      form.subCategoryId?.trim() &&

      form.brandId?.trim(),

  );

}



export function canPreviewSimpleSku(form: any) {

  return Boolean(

    form.customerType?.trim() &&

      form.brandId?.trim() &&

      form.type === "SIMPLE",

  );

}



export function canPreviewVariantSku(form: any) {

  return Boolean(

    form.customerType?.trim() &&

      form.brandId?.trim() &&

      form.type === "VARIABLE",

  );

}



export function getSimpleSkuPlaceholder(form: any) {

  if (form.previewSku?.trim()) {

    return "";

  }



  if (!form.customerType?.trim() || !form.brandId?.trim() || !form.type) {

    return "Select Customer Type, Brand and Product Type to preview SKU.";

  }



  return "";

}



export function extractProductSkuPrefix(variantSku: string): string | null {
  if (!variantSku?.trim()) {
    return null;
  }

  const parts = variantSku.trim().split("-");

  if (parts.length < 5) {
    return null;
  }

  return parts.slice(0, -1).join("-");
}

export function formatVariantSku(productPrefix: string, sequence: number): string {
  return `${productPrefix}-${String(sequence).padStart(3, "0")}`;
}

export function getVariantProductPrefix(form: any): string | null {
  if (form.variantSkuPrefix?.trim()) {
    return form.variantSkuPrefix.trim();
  }

  const activeVariants = (form.variants || []).filter(
    (variant: any) => !variant.isDeleted,
  );

  for (const variant of activeVariants) {
    const prefix = extractProductSkuPrefix(variant.sku);

    if (prefix) {
      return prefix;
    }
  }

  return null;
}

export function recalculateVariantSkus(
  variants: any[],
  productPrefix: string,
): any[] {
  let sequence = 0;

  return variants.map((variant) => {
    if (variant.isDeleted) {
      return variant;
    }

    sequence += 1;

    return {
      ...variant,
      sku: formatVariantSku(productPrefix, sequence),
    };
  });
}

export function getVariantSkuPlaceholder(_variant: any) {
  return "";
}

export function getVariantLabel(variant: any, index: number): string {
  const name = variant?.name?.trim();

  if (name) {
    return `Variant "${name}"`;
  }

  return `Variant ${index + 1}`;
}

export function validatePricingFields(variant: any, label: string) {

  const sellingPrice = Number(variant.sellingPrice);



  if (!sellingPrice || sellingPrice <= 0) {

    return `${label}: Selling Price is required.`;

  }



  const purchasePrice = variant.purchasePrice === "" || variant.purchasePrice === undefined

    ? 0

    : Number(variant.purchasePrice);



  const mrp = variant.mrp === "" || variant.mrp === undefined ? 0 : Number(variant.mrp);



  if (purchasePrice > 0 && sellingPrice < purchasePrice) {

    return `${label}: Selling Price must be greater than or equal to Purchase Price.`;

  }



  if (mrp > 0 && mrp < sellingPrice) {

    return `${label}: Selling Price cannot exceed MRP.`;

  }



  return null;

}



export function createEmptyVariant() {

  return {

    id: crypto.randomUUID(),

    sku: "",

    name: "",

    purchasePrice: "",

    sellingPrice: "",

    mrp: "",

    quantity: "",

    averageRating: 0,

    reviewCount: 0,

    isWeighted: false,

    warrantyMonths: 0,

    attributes: {},

    existingMainImage: "",

    mainFile: null,

    images: [],

    isDeleted: false,

    isPersisted: false,

  };

}



export function getPreviewableVariants(form: any) {

  return (form.variants || []).filter(

    (variant: any) =>

      !variant.isDeleted &&

      !variant.isPersisted &&

      variant.name?.trim(),

  );

}



export function applyVariantSkuPreview(

  variants: any[],

  skus: Array<{ tempId?: string; sku: string }>,

  previewableIds: string[],

) {

  return variants.map((variant: any) => {

    if (variant.isDeleted || variant.isPersisted) {

      return variant;

    }



    const matchById = skus.find((item) => item.tempId === variant.id);



    if (matchById?.sku) {

      return {

        ...variant,

        sku: matchById.sku,

      };

    }



    const previewIndex = previewableIds.indexOf(variant.id);



    if (previewIndex >= 0 && skus[previewIndex]?.sku) {

      return {

        ...variant,

        sku: skus[previewIndex].sku,

      };

    }



    if (skus[0]?.sku && !variant.name?.trim()) {

      return {

        ...variant,

        sku: skus[0].sku,

      };

    }



    return variant;

  });

}



export function extractSkuPreview(response: any): string {

  const body = response?.data;



  console.log("[SKU_TRACE] extractSkuPreview body", body);



  if (!body) {

    return "";

  }



  if (typeof body.data?.sku === "string") {

    console.log("[SKU_TRACE] extractSkuPreview resolved path body.data.sku", body.data.sku);

    return body.data.sku;

  }



  if (typeof body.sku === "string") {

    console.log("[SKU_TRACE] extractSkuPreview resolved path body.sku", body.sku);

    return body.sku;

  }



  console.warn("[SKU_TRACE] extractSkuPreview could not resolve sku from response");

  return "";

}



export function extractVariantSkuPreview(

  response: any,

): Array<{ tempId?: string; sku: string }> {

  const body = response?.data;



  console.log("[SKU_TRACE] extractVariantSkuPreview body", body);



  if (!body) {

    return [];

  }



  const skus = body.data?.skus ?? body.skus ?? [];



  console.log("[SKU_TRACE] extractVariantSkuPreview resolved skus", skus);



  return Array.isArray(skus) ? skus : [];

}

