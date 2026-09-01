"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCheckoutNavigation } from "@/shared/components/checkout-navigation-guard";
import { Spinner } from "@/shared/components/ui/spinner";
import { useCollection } from "@/features/collections/hooks/use-collection";

interface CollectionMegaMenuProps {
  collectionSlug: string;
  onClose?: () => void;
}

const PLACEHOLDER_IMAGE = "/images/product-placeholder.png";

function ProductImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      onError={() => setImageSrc("/Logo/jpl_logo.png")}
      className="
        object-contain
        p-1
        transition-transform
        duration-500
        group-hover:scale-105
      "
    />
  );
}

export function CollectionMegaMenu({
  collectionSlug,
  onClose,
}: CollectionMegaMenuProps) {
  const { navigate } = useCheckoutNavigation();
  const { data, isLoading, isError } =
    useCollection(collectionSlug);

  if (isLoading) {
    return (
      <div className="absolute top-full left-1/2 z-50 w-[950px] -translate-x-1/2 pt-2">
        <div className="flex h-[260px] items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-2xl">
          <Spinner />
        </div>
      </div>
    );
  }

  if (isError || !data?.collection) {
    return (
      <div className="absolute top-full left-1/2 z-50 w-[950px] -translate-x-1/2 pt-2">
        <div className="flex h-[260px] items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-500 shadow-2xl">
          Collections Coming Soon
        </div>
      </div>
    );
  }

  const collection = data.collection;

  const products =
    (data.products ?? []).slice(0, 8);

  return (
    <div className="absolute top-full left-1/2 z-50 w-[950px] -translate-x-1/2 select-none animate-in fade-in slide-in-from-top-2 duration-200 ease-out">
      <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gray-900">
              {collection.name}
            </h3>

            <span className="rounded-md bg-[#E6F7F5] px-2 py-0.5 text-xs font-semibold text-[#0F9EA5]">
              {products.length}
            </span>
          </div>

         <button
  type="button"
  onClick={() => {
    onClose?.();
    navigate(`/collections/${collection.slug}`);
  }}
  className="group inline-flex items-center text-xs font-semibold text-[#0F9EA5]"
>
  View Collection

  <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">
    →
  </span>
</button>
        </div>

        {/* Products */}
        <div className="hide-scrollbar overflow-x-auto p-5">
          {products.length === 0 ? (
            <div className="flex h-36 items-center justify-center text-sm text-gray-400">
              No products available.
            </div>
          ) : (
            <div className="flex w-max gap-4 pr-6">
              {products.map((product) => {
                const variant =
                  product.variants?.find(
                    (item: { id: any }) =>
                      item.id === product.defaultVariantId,
                  ) ||
                  product.variants?.[0];

                const image =
                  variant?.images?.main?.trim() ||
                  product.images?.main?.trim() ||
                  PLACEHOLDER_IMAGE;

                const sellingPrice =
                  variant?.pricing?.sellingPrice ||
                  product.price?.min ||
                  0;

                const mrp =
                  variant?.pricing?.mrp ||
                  0;

                const stockQuantity =
                  typeof variant?.stock === "number"
                    ? variant.stock
                    : variant?.stock?.quantity ?? 0;

                const isInStock = stockQuantity > 0;

                return (
                 <button
  key={product.id}
  type="button"
  onClick={() => {
    onClose?.();
    navigate(`/products/${product.slug}`);
  }}
  className="group w-[180px] shrink-0 text-left"
>
                    <div
                      className="
                        h-full
                        rounded-xl
                        border
                        border-gray-100
                        bg-white
                        p-3
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:border-[#0F9EA5]
                        hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]
                      "
                    >
                      <div
                        className="
                          relative
                          h-24
                          w-full
                          overflow-hidden
                          rounded-lg
                          bg-gray-50/50
                          p-2
                        "
                      >
                        {!isInStock && (
                          <div
                            className="
                              absolute
                              right-1
                              top-1
                              z-20
                              rounded-full
                              bg-red-500
                              px-1.5
                              py-0.5
                              text-[8px]
                              font-bold
                              text-white
                              shadow-sm
                            "
                          >
                            OUT OF STOCK
                          </div>
                        )}
                        <ProductImage
                          src={image}
                          alt={product.name}
                        />
                      </div>

                      <h4
                        className="
                          mt-2
                          line-clamp-2
                          text-[11px]
                          font-medium
                          leading-4
                          text-gray-600
                          transition-colors
                          duration-200
                          group-hover:text-[#0F9EA5]
                        "
                      >
                        {product.name}
                      </h4>

                      <div className="mt-1 flex items-center gap-2">
                        <p className="text-xs font-bold text-[#0F9EA5]">
                          ₹{sellingPrice.toLocaleString()}
                        </p>

                        {mrp > sellingPrice && (
                          <p className="text-[10px] text-gray-700 line-through">
                            ₹{mrp.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}