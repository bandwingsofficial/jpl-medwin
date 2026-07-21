"use client";

import Link from "next/link";

import {
  useCollectionProducts,
} from "../hooks/use-collection-products";

import {
  ProductCard,
} from "@/features/products/components/product-card";

interface Props {
  collectionId: string;
  collectionName: string;
  collectionSlug: string;
  collectionImage?: string;
}

export function CollectionSection({
  collectionId,
  collectionName,
  collectionSlug,
  collectionImage,
}: Props) {
  const {
    data: products = [],
    isLoading,
  } = useCollectionProducts(
    collectionId
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
      {/* Collection Banner Image */}
      <div
        className="
          flex
          items-center
          justify-between
        "
      >
        <div>
          {collectionImage ? (
            <img
  src={collectionImage}
  alt={collectionName}
  className="
    h-12
    w-auto
    object-contain
    md:h-16
  "
/>
          ) : (
            <h2
              className="
                text-2xl
                font-bold
                text-gray-900
              "
            >
              {collectionName}
            </h2>
          )}
        </div>

        {showViewAll && (
          <Link
            href={`/collections/${collectionId}`}
            className="
              rounded-full
              border
              px-6
              py-2
              text-sm
              font-medium
              hover:bg-gray-50
            "
          >
            Explore More
          </Link>
        )}
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