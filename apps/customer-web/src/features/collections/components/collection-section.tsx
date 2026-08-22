"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import {
  useCollectionProducts,
} from "../hooks/use-collection-products";

import {
  ProductCard,
} from "@/features/products/components/product-card";

interface Props {
  collectionSlug: string;
  collectionName: string;
  collectionImage?: string;
}

export function CollectionSection({
  collectionSlug,
  collectionName,
  collectionImage,
}: Props) {
  const {
    data: products = [],
    isLoading,
  } = useCollectionProducts(
    collectionSlug
  );

  if (isLoading) {
    return null;
  }

  if (!products.length) {
    return null;
  }

  const visibleProducts =
    products.slice(0, 6);

  const showViewAll =
    products.length > 6;

  // Split the collection name into words to apply the shiny effect to the last word
  const words = collectionName.trim().split(" ");
  const firstName = words.slice(0, -1).join(" ");
  const lastName = words[words.length - 1];

  return (
    <section
      className="
        relative
        left-1/2
        right-1/2
        -ml-[50vw]
        -mr-[50vw]
        w-screen
        space-y-6
        px-4
        md:px-8
        lg:px-12
      "
    >
      {/* Collection Header */}
      <div className="space-y-4">
        <div
          className="
            flex
            items-center
            justify-between
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            {/* Vertical accent bar - matches Shop by Category style */}
            <span
              className="
                h-8
                w-1
                rounded-full
                bg-[#0D6E63]
              "
            />
            <h2
              className="
                text-3xl
                font-bold
                text-gray-900
              "
            >
              {firstName ? `${firstName} ` : ""}
              <span className="bg-gradient-to-r from-[#0D6E63] via-[#14B8A6] to-[#0D6E63] bg-clip-text text-transparent">
                {lastName}
              </span>
            </h2>
          </div>

          {showViewAll && (
            <Link
              href={`/collections/${collectionSlug}`}
              className="
                group
                flex
                items-center
                gap-1
                text-sm
                font-medium
                text-[#0D6E63]
              "
            >
              <span className="transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-[#0D6E63] group-hover:via-[#14B8A6] group-hover:to-[#0D6E63] group-hover:bg-clip-text group-hover:text-transparent">
                Explore More
              </span>
              <ChevronRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          )}
        </div>

        {/* Divider line - matches Shop by Category style */}
        <div className="border-b border-gray-200" />
      </div>

      {/* Products */}
      <div
        className="
          grid
          grid-cols-2
          gap-4
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-6
          xl:grid-cols-6
        "
      >
        {visibleProducts.map(
          (product: any) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          )
        )}
      </div>
    </section>
  );
}