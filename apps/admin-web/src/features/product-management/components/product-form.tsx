"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ProductFormBasic } from "./product-form-basic";
import { VariantManager } from "./variant-manager";
import { ProductDetailsSection } from "./product-details-section";
import { ProductHighlightsSection } from "./product-highlights-section";
import { ProductSummaryView } from "./product-summary-view";

import { Button } from "@/shared/components/ui/button";

import { useProduct } from "../hooks/use-product";
import { productApi } from "@/infrastructure/api/product.api";

import { Product } from "../types/product.type";
import { showError, showSuccess } from "@/shared/store/toast.store";
import { extractApiError, ApiFieldError } from "@/shared/lib/extract-api-error";

import {
  canPreviewSimpleSku,
  canPreviewVariantSku,
  createEmptyVariant,
  extractProductSkuPrefix,
  extractSkuPreview,
  extractVariantSkuPreview,
  getVariantProductPrefix,
  hasProductBasics,
  mapProductToForm,
  recalculateVariantSkus,
  validatePricingFields,
  getVariantLabel,
} from "../utils/product-form.utils";

interface Props {
  mode?: "create" | "edit";
  initialData?: Product | null;
  onSuccess: () => void;
}

const EMPTY_FORM = {
  name: "",
  type: "",
  customerType: "",
  status: "ACTIVE",
  categoryId: "",
  subCategoryId: "",
  miniCategoryId: "",
  brandId: "",
  hsnCode: "",
  mainImage: null,
  existingMainImage: "",
  images: [],
  shortDescription: "",
  longDescription: "",
  features: [],
  tags: [],
  displayNotes: [],
  packing: [],
  directionOfUse: [],
  additionalInfo: [],
  specifications: [],
  faq: [],
  isWeighted: false,
  isOverweight: false,
  weightKg: "",
  warrantyMonths: 0,
  hasCatalogue: false,
  catalogueFile: null,
  catalogueFileName: "",
  catalogueFileUrl: "",
  catalogueFileType: "",
  catalogueFileSize: null,
  previewSku: "",
  variantSkuPrefix: "",
  variants: [],
};

export function ProductForm({
  mode = "create",
  initialData = null,
  onSuccess,
}: Props) {
  const { createProduct, updateProduct } = useProduct();
  const isEditMode = mode === "edit";

  const initialForm = useMemo(() => {
    if (isEditMode && initialData) {
      return mapProductToForm(initialData);
    }

    return EMPTY_FORM;
  }, [isEditMode, initialData]);

  const [form, setForm] = useState<any>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<ApiFieldError[]>([]);
  const [skuPreviewLoading, setSkuPreviewLoading] = useState(false);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewRequestId = useRef(0);
  const formRef = useRef(form);

  useEffect(() => {
    formRef.current = form;
  }, [form]);

  useEffect(() => {
    if (initialData) {
      setForm(initialForm);
    }
  }, [initialData, initialForm]);

  const basicsReady = hasProductBasics(form);
  const typeSelected = Boolean(form.type);
  const showExtendedSections = basicsReady && typeSelected;
  const isSimple = form.type === "SIMPLE";
  const isVariable = form.type === "VARIABLE";

  const refreshSkuPreview = useCallback(
    async (nextForm: any) => {
      console.log("[SKU_TRACE] refreshSkuPreview called", {
        isEditMode,
        type: nextForm.type,
        brandId: nextForm.brandId,
        categoryId: nextForm.categoryId,
        subCategoryId: nextForm.subCategoryId,
        canPreviewSimple: canPreviewSimpleSku(nextForm),
        currentPreviewSku: nextForm.previewSku,
      });

      if (isEditMode && nextForm.type === "SIMPLE") {
        console.log("[SKU_TRACE] refreshSkuPreview skipped — edit mode SIMPLE");
        return;
      }

      if (nextForm.type === "SIMPLE") {
        if (!canPreviewSimpleSku(nextForm)) {
          console.log("[SKU_TRACE] refreshSkuPreview skipped — canPreviewSimpleSku false");
          return;
        }

        const requestId = ++previewRequestId.current;
        setSkuPreviewLoading(true);

        try {
          console.log("[SKU_TRACE] refreshSkuPreview firing SIMPLE API request", requestId);

          const response = await productApi.previewSku({
            brandId: nextForm.brandId,
            customerType: nextForm.customerType,
            productType: "SIMPLE",
            productName: nextForm.name,
            productId: nextForm.id,
          });

          if (requestId !== previewRequestId.current) {
            console.log("[SKU_TRACE] refreshSkuPreview stale SIMPLE response discarded", {
              requestId,
              current: previewRequestId.current,
            });
            return;
          }

          const sku = extractSkuPreview(response);

          console.log("[SKU_TRACE] refreshSkuPreview extracted sku", sku);

          setForm((prev: any) => {
            const updated = {
              ...prev,
              previewSku: sku || prev.previewSku,
            };

            console.log("[SKU_TRACE] refreshSkuPreview setForm previewSku", updated.previewSku);

            return updated;
          });
        } catch (error) {
          console.error("[SKU_TRACE] SKU preview failed", error);
        } finally {
          if (requestId === previewRequestId.current) {
            setSkuPreviewLoading(false);
          }
        }

        return;
      }

      if (!canPreviewVariantSku(nextForm)) {
        console.log("[SKU_TRACE] refreshSkuPreview skipped — canPreviewVariantSku false");
        return;
      }

      const requestId = ++previewRequestId.current;
      setSkuPreviewLoading(true);

      try {
        console.log("[SKU_TRACE] refreshSkuPreview firing VARIABLE API request", requestId);

        const response = await productApi.previewSku({
          brandId: nextForm.brandId,
          customerType: nextForm.customerType,
          productType: "VARIABLE",
          productName: nextForm.name,
          productId: nextForm.id,
        });

        if (requestId !== previewRequestId.current) {
          console.log("[SKU_TRACE] refreshSkuPreview stale VARIABLE response discarded", {
            requestId,
            current: previewRequestId.current,
          });
          return;
        }

        const skus = extractVariantSkuPreview(response);
        const firstSku = skus[0]?.sku || "";
        const prefix = extractProductSkuPrefix(firstSku);

        console.log("[SKU_TRACE] refreshSkuPreview VARIABLE prefix", prefix);

        setForm((prev: any) => {
          if (!prefix) {
            return prev;
          }

          const updatedVariants = recalculateVariantSkus(prev.variants || [], prefix);

          console.log(
            "[SKU_TRACE] refreshSkuPreview VARIABLE setForm skus",
            updatedVariants
              .filter((v: any) => !v.isDeleted)
              .map((v: any) => ({ id: v.id, name: v.name, sku: v.sku })),
          );

          return {
            ...prev,
            variantSkuPrefix: prefix,
            variants: updatedVariants,
          };
        });
      } catch (error) {
        console.error("[SKU_TRACE] VARIABLE SKU preview failed", error);
      } finally {
        if (requestId === previewRequestId.current) {
          setSkuPreviewLoading(false);
        }
      }
    },
    [isEditMode],
  );

  const scheduleSkuPreview = useCallback(() => {
    if (previewTimer.current) {
      clearTimeout(previewTimer.current);
    }

    previewTimer.current = setTimeout(() => {
      refreshSkuPreview(formRef.current);
    }, 400);
  }, [refreshSkuPreview]);

  useEffect(() => {
    if (isEditMode && form.type === "SIMPLE") {
      return;
    }

    if (form.type === "SIMPLE" && canPreviewSimpleSku(form)) {
      scheduleSkuPreview();
      return;
    }

    if (form.type === "VARIABLE" && canPreviewVariantSku(form)) {
      scheduleSkuPreview();
    }
  }, [
    isEditMode,
    form.brandId,
    form.customerType,
    form.type,
    scheduleSkuPreview,
  ]);

  const skuAffectingFields = [
    "customerType",
    "brandId",
    "type",
  ];

  const handleVariantsChange = (variants: any[]) => {
    setForm((prev: any) => {
      const next = {
        ...prev,
        variants,
      };

      const prefix = getVariantProductPrefix(next);

      if (prefix && canPreviewVariantSku(next)) {
        return {
          ...next,
          variantSkuPrefix: prefix,
          variants: recalculateVariantSkus(variants, prefix),
        };
      }

      return next;
    });
  };

  const updateField = (
    field: string,
    value: any,
    options?: { schedulePreview?: boolean },
  ) => {
    const shouldSchedulePreview = options?.schedulePreview !== false;
    let shouldPreview = false;

    setForm((prev: any) => {
      const next = {
        ...prev,
        [field]: value,
      };

      if (field === "type") {
        if (
          value === "VARIABLE" &&
          !(prev.variants || []).filter((v: any) => !v.isDeleted).length
        ) {
          next.variants = [createEmptyVariant()];
        }

        if (value === "SIMPLE") {
          next.variants = [createEmptyVariant()];
          next.variantSkuPrefix = "";
        }
      }

      if (skuAffectingFields.includes(field)) {
        if (next.type === "SIMPLE" && !isEditMode) {
          next.previewSku = "";
        }

        if (next.type === "VARIABLE") {
          next.variantSkuPrefix = "";
        }
      }

      if (
        shouldSchedulePreview &&
        skuAffectingFields.includes(field)
      ) {
        shouldPreview = true;
      }

      return next;
    });

    if (shouldPreview) {
      console.log("[SKU_TRACE] updateField scheduling preview", { field });
      scheduleSkuPreview();
    }
  };

  const validateForm = (): ApiFieldError[] => {
    const errors: ApiFieldError[] = [];

    if (!form.name?.trim()) {
      errors.push({ field: "name", message: "Product name is required." });
    }

    if (!form.categoryId?.trim()) {
      errors.push({ field: "categoryId", message: "Category is required." });
    }

    if (!form.subCategoryId?.trim()) {
      errors.push({ field: "subCategoryId", message: "Sub Category is required." });
    }

    if (!form.brandId?.trim()) {
      errors.push({ field: "brandId", message: "Brand is required." });
    }

    if (!form.customerType?.trim()) {
      errors.push({ field: "customerType", message: "Customer Type is required." });
    }

    if (!form.type) {
      errors.push({ field: "type", message: "Product type is required." });
    }

    if (!isEditMode && !form.mainImage) {
      errors.push({ field: "mainImage", message: "Main image is required." });
    }

    if (isSimple && !isEditMode && !form.previewSku?.trim()) {
      errors.push({
        field: "previewSku",
        message:
          "SKU preview is not ready yet. Check customer type, brand and product type.",
      });
    }

    if (isSimple) {
      const variant = (form.variants || [])[0] || {};
      const prefix = "variants[0]";
      const label = getVariantLabel(variant, 0);

      const pricingError = validatePricingFields(variant, label);

      if (pricingError) {
        errors.push({
          field: `${prefix}.sellingPrice`,
          message: pricingError,
        });
      }
    }

    if (isVariable) {
      const activeVariants = (form.variants || []).filter(
        (variant: any) => !variant.isDeleted,
      );

      if (!activeVariants.length) {
        errors.push({
          field: "variants",
          message: "At least one variant is required.",
        });
      }

      activeVariants.forEach((variant: any, index: number) => {
        const prefix = `variants[${index}]`;
        const label = getVariantLabel(variant, index);

        if (!variant.name?.trim()) {
          errors.push({
            field: `${prefix}.name`,
            message: `${label}: Variant Name is required.`,
          });
        }

        if (!variant.isPersisted && !variant.sku?.trim()) {
          errors.push({
            field: `${prefix}.sku`,
            message: `${label}: SKU preview is pending.`,
          });
        }

        const pricingError = validatePricingFields(variant, label);

        if (pricingError) {
          errors.push({
            field: `${prefix}.sellingPrice`,
            message: pricingError,
          });
        }
      });
    }

    if (form.isOverweight) {
      const weight = Number(form.weightKg);
      if (!form.weightKg || isNaN(weight) || weight <= 0) {
        errors.push({
          field: "weightKg",
          message: "Product weight in KG is required and must be greater than zero for overweight items.",
        });
      }
    }

    return errors;
  };

  const handleSubmit = async () => {
    const clientErrors = validateForm();

    if (clientErrors.length) {
      setFieldErrors(clientErrors);
      showError(clientErrors[0].message);
      return;
    }

    setFieldErrors([]);

    try {
      const activeVariants = isSimple
        ? [(form.variants || [])[0] || {}]
        : (form.variants || []).filter((variant: any) => !variant.isDeleted);

      const variantMainImages = activeVariants
        .map((variant: any) => variant.mainFile)
        .filter(Boolean);

      const variantImages = activeVariants.flatMap((variant: any) =>
        (variant.images || [])
          .filter((img: any) => img?.file instanceof File)
          .map((img: any) => img.file),
      );

      const mappedVariants = activeVariants.map((variant: any, index: number) => ({
        id: variant.id,
        name: String(variant.name || form.name).trim(),
        purchasePrice:
          variant.purchasePrice === ""
            ? undefined
            : Number(variant.purchasePrice || 0),
        sellingPrice: Number(variant.sellingPrice || 0),
        mrp: variant.mrp === "" ? undefined : Number(variant.mrp || 0),
        quantity:
          variant.quantity === "" ? undefined : Number(variant.quantity || 0),
        averageRating: Number(variant.averageRating || 0),
        reviewCount: Number(variant.reviewCount || 0),
        isWeighted: variant.isWeighted === true,
        warrantyMonths: Number(variant.warrantyMonths || 0),
        attributes: variant.attributes || {},
        images: variant.images || [],
        priorityOrder: index,
        isDeleted: variant.isDeleted === true,
      }));

      const deletedVariants = (form.variants || [])
        .filter((variant: any) => variant.isDeleted && variant.id)
        .map((variant: any) => ({
          id: variant.id,
          isDeleted: true,
        }));

      const payload: any = {
        name: String(form.name || "").trim(),
        type: form.type,
        customerType: form.customerType,
        status: form.status,
        categoryId: String(form.categoryId || "").trim(),
        subCategoryId: String(form.subCategoryId || "").trim(),
        brandId: String(form.brandId || "").trim(),
        hsnCode: String(form.hsnCode || "").trim(),
        shortDescription: String(form.shortDescription || "").trim(),
        longDescription: String(form.longDescription || "").trim(),
        features: Array.isArray(form.features) ? form.features : [],
        tags: Array.isArray(form.tags) ? form.tags : [],
        displayNotes: Array.isArray(form.displayNotes) ? form.displayNotes : [],
        packing: Array.isArray(form.packing) ? form.packing : [],
        directionOfUse: Array.isArray(form.directionOfUse)
          ? form.directionOfUse
          : [],
        additionalInfo: Array.isArray(form.additionalInfo)
          ? form.additionalInfo
          : [],
        specifications: Array.isArray(form.specifications)
          ? form.specifications
          : [],
        faq: Array.isArray(form.faq) ? form.faq : [],
        isWeighted: form.isWeighted === true,
        isOverweight: form.isOverweight === true,
        weightKg: form.isOverweight ? Number(form.weightKg || 0) : null,
        warrantyMonths: Number(form.warrantyMonths || 0),
        hasCatalogue: form.hasCatalogue === true,
        catalogueFile: form.catalogueFile instanceof File ? form.catalogueFile : null,
        catalogueFileName: form.catalogueFileName || null,
        catalogueFileUrl: form.catalogueFileUrl || null,
        catalogueFileType: form.catalogueFileType || null,
        catalogueFileSize: typeof form.catalogueFileSize === "number" ? form.catalogueFileSize : null,
        mainImage: form.mainImage,
        images: form.images || [],
        variants: [...mappedVariants, ...deletedVariants],
        variantMainImages,
        variantImages,
      };

      if (form.miniCategoryId?.trim()) {
        payload.miniCategoryId = String(form.miniCategoryId).trim();
      }

      if (!isEditMode) {
        await createProduct.mutateAsync(payload);
        showSuccess("Product created successfully");
      } else {
        await updateProduct.mutateAsync({
          productId: form.id,
          payload,
        });
        showSuccess("Product updated successfully");
      }

      onSuccess();
    } catch (error) {
      console.error("PRODUCT SUBMIT FAILED =>", error);

      const parsed = extractApiError(error);

      setFieldErrors(parsed.errors);
      showError(parsed.message);
    }
  };

  return (
    <div className="space-y-8 pb-4 relative">
      {fieldErrors.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 space-y-1">
          <p className="font-semibold">Please fix the following:</p>
          <ul className="list-disc pl-5 space-y-1">
            {fieldErrors.map((item, index) => (
              <li key={`${item.field}-${index}`}>{item.message}</li>
            ))}
          </ul>
        </div>
      )}

      <ProductFormBasic
        data={form}
        onChange={updateField}
        showExtendedSections={showExtendedSections}
        isEditMode={isEditMode}
        skuPreviewLoading={skuPreviewLoading}
        fieldErrors={fieldErrors}
      />

      {showExtendedSections && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProductHighlightsSection data={form} onChange={updateField} />
          <ProductDetailsSection data={form} onChange={updateField} />
        </div>
      )}

      {showExtendedSections && isVariable && (
        <VariantManager
          variants={form.variants}
          onChange={handleVariantsChange}
          isEditMode={isEditMode}
          fieldErrors={fieldErrors}
        />
      )}

      {showExtendedSections && <ProductSummaryView data={form} />}

      {showExtendedSections && (
        <div className="sticky bottom-[-24px] mx-[-24px] px-8 py-4 bg-white border-t flex justify-end gap-3 z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] rounded-b-2xl">
          <Button variant="secondary" onClick={onSuccess}>
            Cancel
          </Button>

          <Button
            size="lg"
            onClick={handleSubmit}
            loading={createProduct.isPending || updateProduct.isPending}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8"
          >
            {isEditMode ? "Update Product" : "Save Product"}
          </Button>
        </div>
      )}
    </div>
  );
}
