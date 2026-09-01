"use client";

import { MessageCircle } from "lucide-react";

import {
  Product,
  ProductVariant,
} from "@/features/products/types/product.type";

import {
  openBulkOrderModal,
} from "@/features/bulk-order/store/bulk-order-modal.store";

interface ProductCommercialDetailsProps {
  product: Product;
  selectedVariant?: ProductVariant | null;
}

export function ProductCommercialDetails({
  product,
  selectedVariant,
}: ProductCommercialDetailsProps) {
  const handleGetQuote = () => {
    const variantName =
      selectedVariant?.name ||
      product.name;

    const sellingPrice =
      selectedVariant?.pricing?.sellingPrice ??
      product.price?.min ??
      0;

    openBulkOrderModal({
      productName: product.name,
      variantName,
      attributes: selectedVariant?.attributes
        ? Object.entries(selectedVariant.attributes)
        : undefined,
      productId: product.id,
      variantId: selectedVariant?.id,
      sellingPrice,
      image:
        selectedVariant?.images?.main ||
        product.images?.main,
      productSlug: product.slug,
      requestedQuantity: 10,
    });
  };

  return (
    <div className="w-full space-y-3">
      {/* BULK QUOTE */}
      <div
        className="
          flex
          w-full
          flex-col
          gap-3
          rounded-2xl
          border
          border-teal-200
          bg-white
          p-3
          shadow-sm

          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:gap-4
          sm:px-4
          sm:py-3
        "
      >
        {/* BULK QUANTITY TEXT */}
        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
          "
        >
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-teal-50
              text-teal-600
            "
          >
            <MessageCircle
              className="h-5 w-5"
            />
          </div>

          <div className="min-w-0">
            <p
              className="
                text-sm
                font-semibold
                leading-5
                text-slate-800

                sm:text-base
              "
            >
              Want to buy more quantity?
            </p>

            <p
              className="
                mt-0.5
                text-xs
                leading-5
                text-slate-500

                sm:text-sm
              "
            >
              Get a custom quote for bulk orders.
            </p>
          </div>
        </div>

        {/* GET BULK QUOTE BUTTON */}
        <button
          type="button"
          onClick={handleGetQuote}
          className="
            inline-flex
            h-11
            w-full
            shrink-0
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-teal-600
            px-4
            text-xs
            font-semibold
            uppercase
            tracking-wide
            text-white
            transition-all
            duration-200
            hover:bg-teal-700
            active:scale-[0.98]

            sm:w-auto
            sm:min-w-[190px]
            sm:px-5
          "
        >
          <MessageCircle className="h-4 w-4 shrink-0" />

          <span className="whitespace-nowrap">
            Get Bulk Quote
          </span>
        </button>
      </div>

      {/* DESCRIPTION */}
      {!!product.descriptions?.short && (
        <div>
          <p
            className="
              text-xs
              font-semibold
              text-gray-800
              sm:text-sm
            "
          >
            Description :
          </p>

          <p
            className="
              mt-1
              text-xs
              leading-6
              text-gray-600
              sm:text-sm
            "
          >
            {product.descriptions.short}
          </p>
        </div>
      )}
    </div>
  );
}