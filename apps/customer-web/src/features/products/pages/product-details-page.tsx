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
import { ProductBuyBox } from "@/features/products/components/ProductBuyBox";

import { useProductDetails } from "@/features/products/hooks/use-product-details";

interface ProductDetailsPageProps {
  productSlug: string;
}

export function ProductDetailsPage({
  productSlug,
}: ProductDetailsPageProps) {
  const { data, isLoading, isError, error } = useProductDetails(productSlug);
  const product = data?.data;

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  const selectedVariant = useMemo<ProductVariant | null>(() => {
    if (!product?.variants?.length) {
      return null;
    }

    return (
      product.variants.find((variant) => variant.id === selectedVariantId) ||
      product.variants[0]
    );
  }, [product?.variants, selectedVariantId]);

  const mrp = selectedVariant?.pricing?.mrp || product?.price?.max || 0;
  const sellingPrice = selectedVariant?.pricing?.sellingPrice || product?.price?.min || 0;

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
        pb-36
        bg-[#fafafa]
        min-h-screen

        lg:max-w-[1400px]
        lg:px-6
        lg:py-8
        lg:pb-8
        lg:bg-transparent
      "
    >
      <div
        className="
          grid
          grid-cols-1
          items-start
          gap-6

          lg:grid-cols-[460px_minmax(0,1fr)]
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
lg:top-32
lg:self-start
            lg:p-0
            lg:border-0
            lg:rounded-none
            lg:shadow-none
            lg:bg-transparent
          "
        >
          <ProductGallery
            product={product}
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
          {/* 1. HEADER INFO */}
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

          {/* 3. BUY BOX (Price, Stock & Actions / Add to Cart + Wishlist) - DESKTOP VIEW */}
          <div className="order-3 lg:order-none hidden lg:block">
            <ProductBuyBox
              product={product}
              selectedVariant={selectedVariant}
            />
          </div>

          {/* 4. COMMERCIAL DETAILS (Delivery, Short Description, Features) */}
          <div className="order-4 lg:order-none flex flex-col gap-5 lg:gap-0">
            <ProductCommercialDetails
              product={product}
              selectedVariant={selectedVariant}
            />
          </div>

          <div className="order-3 lg:hidden mt-2">
  <ProductBuyBox
    product={product}
    selectedVariant={selectedVariant}
  />
</div>

        </div>
      </div>

      {/* BOTTOM SECTION */}
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
        <ProductDescription
          descriptions={product.descriptions}
          packing={product.packing || []}
          directionOfUse={product.directionOfUse || []}
          additionalInfo={product.additionalInfo || []}
          faq={product.faq || []}
        />

        <ProductSpecifications specifications={product.specifications || []} />

        <RelatedProducts
          currentProductId={product.id}
          categoryId={product.category?.id}
        />
      </div>

      {/* PREMIUM STICKY MOBILE BOTTOM BAR */}
      <div
        className="
          fixed
          bottom-14
          left-0
          right-0
          z-30
          bg-white/95
          backdrop-blur-xl
          border-t
          border-gray-100
          px-4
          py-3
          shadow-[0_-8px_30px_rgba(0,0,0,0.12)]
          block
          lg:hidden
        "
      >
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
              Total Price
            </span>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-lg font-bold text-gray-900">
                ₹ {sellingPrice.toLocaleString()}
              </span>
              {mrp > sellingPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ₹ {mrp.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 max-w-[220px]">
            <ProductActions
              product={product}
              selectedVariant={selectedVariant}
            />
          </div>
        </div>
      </div>
    </div>
  );
}