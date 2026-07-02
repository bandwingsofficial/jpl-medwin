"use client";

import Link from "next/link";
import Image from "next/image";

import { Spinner } from "@/shared/components/ui/spinner";
import { useCollection } from "@/features/collections/hooks/use-collection";

interface CollectionMegaMenuProps {
  collectionId: string;
}

const PLACEHOLDER_IMAGE = "/images/product-placeholder.png";

export function CollectionMegaMenu({
  collectionId,
}: CollectionMegaMenuProps) {
  const { data, isLoading, isError } = useCollection(collectionId);

  if (isLoading) {
    return (
      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[950px] z-50">
        <div className="flex h-[260px] items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-2xl">
          <Spinner />
        </div>
      </div>
    );
  }

  if (isError || !data?.collection) {
    return (
      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[950px] z-50">
        <div className="flex h-[260px] items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-500 shadow-2xl">
          Failed to load collection.
        </div>
      </div>
    );
  }

  const collection = data.collection;
  const products = (data.products ?? []).slice(0, 8);

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[950px] z-50 select-none animate-in fade-in slide-in-from-top-2 duration-200 ease-out">
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
          
          <Link
            href={`/collections/${collection.id}`}
            className="group inline-flex items-center text-xs font-semibold text-[#0F9EA5]"
          >
            View Collection 
            <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Single Row Horizontal Scrollable Products */}
        <div className="hide-scrollbar overflow-x-auto p-5">
          {products.length === 0 ? (
            <div className="flex h-36 items-center justify-center text-sm text-gray-400">
              No products available.
            </div>
          ) : (
            <div className="flex gap-4">
              {products.map((product) => {
                const variant =
                  product.variants?.find(
                    (item: { id: any; }) => item.id === product.defaultVariantId
                  ) || product.variants?.[0];

                const image =
                  variant?.images?.main?.trim() ||
                  product.images?.main?.trim() ||
                  PLACEHOLDER_IMAGE;

                const sellingPrice =
                  variant?.pricing?.sellingPrice ||
                  product.price?.min ||
                  0;

                const productSlug = product.slug || product.id;

                return (
                  <Link
                    key={product.id}
                    href={`/products/${productSlug}`}
                    className="group w-[180px] shrink-0"
                  >
                    <div className="h-full rounded-xl border border-gray-100 p-3 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#0F9EA5] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                      <div className="relative h-24 w-full overflow-hidden rounded-lg bg-gray-50/50 p-2">
                        <Image
                          src={image}
                          alt={product.name}
                          fill
                          className="object-contain p-1 transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <h4 className="mt-2 line-clamp-2 h-8 text-[11px] font-medium text-gray-600 transition-colors duration-200 group-hover:text-[#0F9EA5]">
                        {product.name}
                      </h4>

                      <p className="mt-1 text-xs font-bold text-[#0F9EA5]">
                        ₹{sellingPrice.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}