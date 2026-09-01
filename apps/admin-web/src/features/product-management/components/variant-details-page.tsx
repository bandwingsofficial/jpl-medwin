"use client";

import { useVariantDetails } from "../hooks/use-variant";
import { useProductDetails } from "../hooks/use-product-details";

import { Loader } from "@/shared/components/ui/loader";
import { EmptyState } from "@/shared/components/ui/empty-state";

import { VariantDetailsHeader } from "./variant-details-header";
import { VariantDetailsContent } from "./variant-details-content";
import { VariantDetailsMedia } from "./variant-details-media";

import { ProductCommonDetails } from "./product-common-details";

// =========================================
// TYPES
// =========================================

interface VariantDetailsPageProps {
  productId: string;
  variantId: string;
}

// =========================================
// COMPONENT
// =========================================

export function VariantDetailsPage({
  productId,
  variantId,
}: VariantDetailsPageProps) {
  // =========================================
  // VARIANT QUERY
  // =========================================

  const {
    variantDetailsQuery,
  } = useVariantDetails({
    productId,
    variantId,
  });

  // =========================================
  // PRODUCT QUERY
  // =========================================
  //
  // IMPORTANT:
  // ProductCommonDetails needs PRODUCT data,
  // not variant data.
  //
  // The productId comes from the route.
  //
  // =========================================

  const {
    productDetailsQuery,
  } = useProductDetails({
    productId,
  });

  // =========================================
  // LOADING
  // =========================================

  if (
    variantDetailsQuery.isLoading ||
    productDetailsQuery.isLoading
  ) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader />
      </div>
    );
  }

  // =========================================
  // VARIANT ERROR
  // =========================================

  if (variantDetailsQuery.isError) {
    return (
      <div className="py-10">
        <EmptyState
          title="Failed to load variant details"
        />
      </div>
    );
  }

  // =========================================
  // PRODUCT ERROR
  // =========================================

  if (productDetailsQuery.isError) {
    return (
      <div className="py-10">
        <EmptyState
          title="Failed to load product details"
        />
      </div>
    );
  }

  // =========================================
  // VARIANT DATA
  // =========================================

  const variant =
    variantDetailsQuery.data?.data;

  // =========================================
  // PRODUCT DATA
  // =========================================

  const product =
    productDetailsQuery.data?.data;

  // =========================================
  // VARIANT EMPTY
  // =========================================

  if (!variant) {
    return (
      <div className="py-10">
        <EmptyState
          title="Variant not found"
        />
      </div>
    );
  }

  // =========================================
  // PRODUCT EMPTY
  // =========================================

  if (!product) {
    return (
      <div className="py-10">
        <EmptyState
          title="Product not found"
        />
      </div>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <div className="space-y-5">

      {/* ===================================== */}
      {/* VARIANT HEADER */}
      {/* ===================================== */}

      <VariantDetailsHeader
        productId={productId}
        variant={variant}
      />

      {/* ===================================== */}
      {/* VARIANT DETAILS + MEDIA */}
      {/* ===================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          lg:grid-cols-[minmax(0,1fr)_360px]
          lg:items-start
        "
      >

        {/* ================================= */}
        {/* LEFT */}
        {/* ================================= */}

        <div className="min-w-0">

          <VariantDetailsContent
            variant={variant}
          />

        </div>

        {/* ================================= */}
        {/* RIGHT */}
        {/* ================================= */}

        <aside
          className="
            min-w-0
            lg:sticky
            lg:top-5
            lg:self-start
          "
        >
          <VariantDetailsMedia
            variant={variant}
          />
        </aside>

      </div>

      {/* ===================================== */}
      {/* COMMON PRODUCT DETAILS */}
      {/* ===================================== */}
      {/*
        This is PRODUCT-level information.

        Same product information will therefore
        appear for every variant of this product.
      */}

      <ProductCommonDetails
  product={{
    ...product,

    packing: Array.isArray(product.packing)
      ? product.packing.join(", ")
      : product.packing,

    directionOfUse: Array.isArray(
      product.directionOfUse
    )
      ? product.directionOfUse.join(" ")
      : product.directionOfUse,

    additionalInfo: Array.isArray(
      product.additionalInfo
    )
      ? product.additionalInfo.join(" ")
      : product.additionalInfo,
  }}
/>
    </div>
  );
}