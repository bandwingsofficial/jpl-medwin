"use client";

import { useMemo, useState } from "react";

import { ProductVariant } from "@/features/products/types/product.type";
import { RelatedProducts } from "@/features/products/components/related-products";
import { ProductActions } from "@/features/products/components/product-actions";
import { ProductDescription } from "@/features/products/components/product-description";
import { ProductDetailsError } from "@/features/products/components/product-details-error";
import { ProductDetailsSkeleton } from "@/features/products/components/product-details-skeleton";
import { ProductGallery } from "@/features/products/components/product-gallery";
import { ProductHeaderInfo } from "@/features/products/components/ProductHeaderInfo";
import { ProductCommercialDetails } from "@/features/products/components/ProductCommercialDetails";
import { ProductSpecifications } from "@/features/products/components/product-specifications";
import { ProductVariantSelector } from "@/features/products/components/product-variant-selector";

import { useProductDetails } from "@/features/products/hooks/use-product-details";

interface ProductDetailsPageProps {
  productSlug: string;
}

export function ProductDetailsPage({
  productSlug,
}: ProductDetailsPageProps) {
  /*
   |--------------------------------------------------------------------------
   | API
   |--------------------------------------------------------------------------
   */

  const { data, isLoading, isError, error } = useProductDetails(productSlug);
  const product = data?.data;

  /*
   |--------------------------------------------------------------------------
   | VARIANT STATE
   |--------------------------------------------------------------------------
   */

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  /*
   |--------------------------------------------------------------------------
   | SELECTED VARIANT
   |--------------------------------------------------------------------------
   */

  const selectedVariant = useMemo<ProductVariant | null>(() => {
    if (!product?.variants?.length) {
      return null;
    }

    return (
      product.variants.find((variant) => variant.id === selectedVariantId) ||
      product.variants[0]
    );
  }, [product?.variants, selectedVariantId]);

  /*
   |--------------------------------------------------------------------------
   | LOADING / ERROR STATES
   |--------------------------------------------------------------------------
   */

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (isError || !product) {
    return (
      <ProductDetailsError
        message={error?.message || "Failed to load product."}
      />
    );
  }

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-md
        px-4
        py-4
        bg-[#fafafa]
        min-h-screen

        lg:max-w-[1400px]
        lg:px-6
        lg:py-8
        lg:bg-transparent
      "
    >
      {/* ====================================================== */}
      {/* TOP SECTION */}
      {/* ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          items-start
          gap-6

          lg:grid-cols-[560px_minmax(0,1fr)]
          lg:gap-12
        "
      >
        {/* LEFT SIDE (GALLERY) */}
        <div
          className="
            relative
            w-full
            bg-white
            rounded-2xl
            p-2
            border
            border-gray-100
            shadow-sm

            lg:sticky
            lg:top-4
            lg:p-0
            lg:border-0
            lg:rounded-none
            lg:shadow-none
            lg:bg-transparent
          "
        >
          <ProductGallery
            mainImage={selectedVariant?.images?.main || product.images?.main}
            images={
              selectedVariant?.images?.gallery?.length
                ? selectedVariant.images.gallery
                : product.images?.gallery || []
            }
          />
        </div>

        {/* RIGHT SIDE (INFO & ACTIONS) */}
        <div
          className="
            flex
            min-w-0
            flex-col
            gap-5
            bg-white
            rounded-2xl
            p-4
            border
            border-gray-100
            shadow-sm

            lg:p-0
            lg:border-0
            lg:rounded-none
            lg:shadow-none
            lg:bg-transparent
            lg:gap-6
          "
        >
          {/* 1. HEADER INFO (Brand, Title, Delivery, Ratings) */}
          <div className="order-1 lg:order-none">
            <ProductHeaderInfo
              product={product}
              selectedVariant={selectedVariant}
            />
          </div>

          {/* 2. VARIANT SELECTOR */}
          {!!product.variants?.length && (
            <div className="order-2 lg:order-none">
              <ProductVariantSelector
                variants={product.variants}
                selectedVariantId={selectedVariant?.id || ""}
                onChange={setSelectedVariantId}
              />
            </div>
          )}

          {/* 3. ACTIONS (ADD TO CART) */}
          <div className="order-3 lg:order-none">
            <ProductActions
              product={product}
              selectedVariant={selectedVariant}
            />
          </div>

          {/* 4. COMMERCIAL DETAILS (Pricing, Stock, Specifications, Features) */}
          <div className="order-4 lg:order-none flex flex-col gap-5 lg:gap-0">
            <ProductCommercialDetails
              product={product}
              selectedVariant={selectedVariant}
            />
          </div>
        </div>
      </div>

      {/* ====================================================== */}
      {/* BOTTOM SECTION */}
      {/* ====================================================== */}

      <div
        className="
          mt-6 
          space-y-6
          bg-white
          rounded-2xl
          p-4
          border
          border-gray-100
          shadow-sm

          lg:mt-14 
          lg:space-y-10
          lg:p-0
          lg:border-0
          lg:rounded-none
          lg:shadow-none
          lg:bg-transparent
        "
      >
        {/* DESCRIPTION */}
        <ProductDescription
          descriptions={product.descriptions}
          packing={product.packing || []}
          directionOfUse={product.directionOfUse || []}
          additionalInfo={product.additionalInfo || []}
          faq={product.faq || []}
        />

        {/* SPECIFICATIONS */}
        <ProductSpecifications specifications={product.specifications || []} />

        {/* RELATED PRODUCTS */}
        <RelatedProducts
          currentProductId={product.id}
          categoryId={product.category?.id}
        />
      </div>
    </div>
  );
}