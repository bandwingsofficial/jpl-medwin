"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { ProductFormBasic } from "./product-form-basic";
import { VariantManager } from "./variant-manager";
import { ProductDetailsSection } from "./product-details-section";
import { ProductHighlightsSection } from "./product-highlights-section";
import { ProductSummaryView } from "./product-summary-view";

import { Button } from "@/shared/components/ui/button";

import { useProduct } from "../hooks/use-product";

import {
  Product,
  ProductImage,
} from "../types/product.type";
import { showError, showSuccess } from "@/shared/store/toast.store";

// =========================================
// TYPES
// =========================================

interface Props {
  mode?: "create" | "edit";

  initialData?: Product | null;

  onSuccess: () => void;
}

// =========================================
// PRODUCT FORM
// =========================================

export function ProductForm({
  mode = "create",
  initialData = null,
  onSuccess,
}: Props) {

  const {
    createProduct,
    updateProduct,
  } = useProduct();

  // =========================================
  // MODE
  // =========================================

  const isEditMode =
    mode === "edit";

  // =========================================
  // INITIAL FORM
  // =========================================

  const initialForm =
    useMemo(() => {

      // =====================================
      // EDIT MODE
      // =====================================

      if (
        isEditMode &&
        initialData
      ) {

        return {

          id:
            initialData.id,

          name:
            initialData.name || "",

          type:
            initialData.type || "SIMPLE",

          status:
            initialData.status || "ACTIVE",

          categoryId:
  initialData.category.id ||
  initialData.category?.id ||
  "",

subCategoryId:
  initialData.subCategory.id ||
  initialData.subCategory?.id ||
  "",

miniCategoryId:
  initialData.miniCategory.id ||
  initialData.miniCategory?.id ||
  "",

brandId:
  initialData.brand.id ||
  initialData.brand?.id ||
  "",

mainImage:
  null,

existingMainImage:
 initialData.images.main ||
  initialData.images?.main ||
  "",

images:
  (
    initialData.images.gallery ||
    initialData.images?.gallery ||
    []
  ).map(
    (url: string) => ({
      url,
    })
  ),

shortDescription:
  initialData.shortDescription ||
  "",

longDescription:
  initialData.longDescription ||
  "",
          features:
            initialData.features || [],

          tags:
            initialData.tags || [],

          displayNotes:
            initialData.displayNotes || [],

          packing:
            initialData.packing || [],

          directionOfUse:
            initialData.directionOfUse || [],

          additionalInfo:
            initialData.additionalInfo || [],

          specifications:
            initialData.specifications || [],

          faq:
            initialData.faq || [],

          isWeighted:
            initialData.isWeighted || false,

          warrantyMonths:
            initialData.warrantyMonths || 0,

          variants:
            (
              initialData.variants || []
            ).map((variant: any) => ({

              id:
                variant.id,

              sku:
                variant.sku,

              name:
                variant.name,

              purchasePrice:
                variant.pricing
                  ?.purchasePrice || 0,

              sellingPrice:
                variant.pricing
                  ?.sellingPrice || 0,

              mrp:
                variant.pricing
                  ?.mrp || 0,

              quantity:
                variant.stock || 0,

              averageRating:
                variant.ratings
                  ?.average || 0,

              reviewCount:
                variant.ratings
                  ?.count || 0,

              isWeighted:
                variant.isWeighted || false,

              warrantyMonths:
                variant.warrantyMonths || 0,

              attributes:
                variant.attributes || {},

              existingMainImage:
                variant.images?.main || "",

              mainFile:
                null,

              images:
                (
                  variant.images
                    ?.gallery || []
                ).map(
                  (url: string) => ({
                    url,
                  })
                ),
            })),
        };
      }

      // =====================================
      // CREATE MODE
      // =====================================

      return {

        name: "",

        type: "SIMPLE",

        status: "ACTIVE",

        categoryId: "",

        subCategoryId: "",

        miniCategoryId: "",

        brandId: "",

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

        warrantyMonths: 0,

        variants: [],
      };

    }, [
      isEditMode,
      initialData,
    ]);

  // =========================================
  // STATE
  // =========================================

  const [form, setForm] =
    useState<any>(
      initialForm
    );
useEffect(() => {

  if (
    initialData
  ) {

    setForm(
      initialForm
    );

  }

}, [
  initialData,
  initialForm,
]);
  // =========================================
  // RESET ON DATA CHANGE
  // =========================================
  // =========================================
  // FIELD UPDATE
  // =========================================

  const updateField = (
    field: string,
    value: any
  ) => {

    setForm((prev: any) => ({
      ...prev,
      [field]: value,
    }));

  };

  // =========================================
  // VALIDATION
  // =========================================

  const validateForm = () => {

    if (!form.name?.trim()) {
      showError("Product name is required");
      return false;
    }

    if (!form.categoryId?.trim()) {
      showError("Category is required");
      return false;
    }

    if (!form.subCategoryId?.trim()) {
      showError("Sub Category is required");
      return false;
    }

    if (!form.miniCategoryId?.trim()) {
      showError("Mini Category is required");
      return false;
    }

    if (!form.brandId?.trim()) {
      showError("Brand is required");
      return false;
    }

    // CREATE ONLY
    if (
      !isEditMode &&
      !form.mainImage
    ) {

      showError(
        "Main image is required"
      );

      return false;
    }

    if (
      !form.shortDescription?.trim()
    ) {

      showError(
        "Short description is required"
      );

      return false;
    }

    if (
      !form.variants?.length
    ) {

      showError(
        "At least one variant is required"
      );

      return false;
    }

    return true;
  };

  // =========================================
  // SUBMIT
  // =========================================

  const handleSubmit = async () => {

    if (!validateForm()) {
      return;
    }

    try {

      // =====================================
      // VARIANT MAIN IMAGES
      // =====================================

      const variantMainImages =
        form.variants
          .map((v: any) =>
            v.mainFile
          )
          .filter(Boolean);

      // =====================================
      // VARIANT GALLERY IMAGES
      // =====================================

      const variantImages =
        form.variants
          .flatMap((v: any) =>
            (v.images || [])
              .filter(
                (img: any) =>
                  img?.file instanceof File
              )
              .map(
                (img: any) =>
                  img.file
              )
          );

      // =====================================
      // MAP VARIANTS
      // =====================================

      const mappedVariants =
        form.variants.map(
          (v: any) => ({

            id:
              v.id,

            sku:
              String(
                v.sku || ""
              ).trim(),

            name:
              String(
                v.name ||
                form.name
              ).trim(),

            purchasePrice:
              Number(
                v.purchasePrice || 0
              ),

            sellingPrice:
              Number(
                v.sellingPrice || 0
              ),

            mrp:
              Number(
                v.mrp || 0
              ),

            quantity:
              Number(
                v.quantity || 0
              ),

            averageRating:
              Number(
                v.averageRating || 0
              ),

            reviewCount:
              Number(
                v.reviewCount || 0
              ),

            isWeighted:
              v.isWeighted === true,

            warrantyMonths:
              Number(
                v.warrantyMonths || 0
              ),

            attributes:
              v.attributes || {},

            images:
              v.images || [],
          })
        );

      // =====================================
      // PAYLOAD
      // =====================================

      const payload = {

        name:
          String(
            form.name || ""
          ).trim(),

        type:
          form.type,

        status:
          form.status,

        categoryId:
          String(
            form.categoryId || ""
          ).trim(),

        subCategoryId:
          String(
            form.subCategoryId || ""
          ).trim(),

        miniCategoryId:
          String(
            form.miniCategoryId || ""
          ).trim(),

        brandId:
          String(
            form.brandId || ""
          ).trim(),

        shortDescription:
          String(
            form.shortDescription || ""
          ).trim(),

        longDescription:
          String(
            form.longDescription || ""
          ).trim(),

        features:
          Array.isArray(
            form.features
          )
            ? form.features
            : [],

        tags:
          Array.isArray(
            form.tags
          )
            ? form.tags
            : [],

        displayNotes:
          Array.isArray(
            form.displayNotes
          )
            ? form.displayNotes
            : [],

        packing:
          Array.isArray(
            form.packing
          )
            ? form.packing
            : [],

        directionOfUse:
          Array.isArray(
            form.directionOfUse
          )
            ? form.directionOfUse
            : [],

        additionalInfo:
          Array.isArray(
            form.additionalInfo
          )
            ? form.additionalInfo
            : [],

        specifications:
          Array.isArray(
            form.specifications
          )
            ? form.specifications
            : [],

        faq:
          Array.isArray(
            form.faq
          )
            ? form.faq
            : [],

        isWeighted:
          form.isWeighted === true,

        warrantyMonths:
          Number(
            form.warrantyMonths || 0
          ),

        mainImage:
          form.mainImage,

        images:
          form.images || [],

        variants:
          mappedVariants,

        variantMainImages,

        variantImages,
      };

      // =====================================
      // CREATE
      // =====================================

      if (!isEditMode) {

        await createProduct.mutateAsync(
          payload
        );

        showSuccess(
          "Product created successfully"
        );

      }

      // =====================================
      // UPDATE
      // =====================================

      else {

        await updateProduct.mutateAsync({

          productId:
            form.id,

          payload,
        });

        showSuccess(
          "Product updated successfully"
        );
      }

      onSuccess();

    } catch (error) {

      console.error(
        "PRODUCT SUBMIT FAILED =>",
        error
      );

      showError(
        isEditMode
          ? "Failed to update product"
          : "Failed to create product"
      );
    }
  };

  // =========================================
  // UI
  // =========================================

  return (
    <div className="space-y-8 pb-4 relative">

      {/* BASIC */}

      <ProductFormBasic
        data={form}
        onChange={updateField}
      />

      {/* DETAILS */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <ProductHighlightsSection
          data={form}
          onChange={updateField}
        />

        <ProductDetailsSection
          data={form}
          onChange={updateField}
        />

      </div>

      {/* VARIANTS */}

      <VariantManager
        variants={form.variants}
        onChange={(variants) =>
          updateField(
            "variants",
            variants
          )
        }
      />

      {/* SUMMARY */}

      <ProductSummaryView
        data={form}
      />

      {/* FOOTER */}

      <div className="sticky bottom-[-24px] mx-[-24px] px-8 py-4 bg-white border-t flex justify-end gap-3 z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] rounded-b-2xl">

        <Button
          variant="secondary"
          onClick={onSuccess}
        >
          Cancel
        </Button>

        <Button
          size="lg"
          onClick={handleSubmit}
          loading={
            createProduct.isPending ||
            updateProduct.isPending
          }
          className="bg-purple-600 hover:bg-purple-700 text-white px-8"
        >
          {isEditMode
            ? "Update Product"
            : "Save Product"}
        </Button>

      </div>
    </div>
  );
}