// src/features/wishlist/components/wishlist-card.tsx

"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Heart,
  Star,
  Trash2,
  Loader2,
} from "lucide-react";

import { WishlistItem } from "@/features/wishlist/types/wishlist.type";

import { useRemoveFromWishlist } from "@/features/wishlist/hooks/use-remove-from-wishlist";

interface WishlistCardProps {
  item: WishlistItem;
}

const PLACEHOLDER_IMAGE =
  "/images/product-placeholder.png";

export function WishlistCard({
  item,
}: WishlistCardProps) {
  const {
    mutateAsync:
      removeFromWishlist,

    isPending,
  } =
    useRemoveFromWishlist();

  const product =
    item.product;

  const image =
    product.image.main ||
    PLACEHOLDER_IMAGE;

  const price =
    product.pricing.minPrice ||
    product.pricing.maxPrice ||
    0;

  const handleRemove =
    async (
      e: React.MouseEvent<HTMLButtonElement>
    ) => {
      e.preventDefault();

      e.stopPropagation();

      try {
        await removeFromWishlist(
          product.id
        );
      } catch (
        error
      ) {
        console.error(
          error
        );
      }
    };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block h-full"
    >
      <article
        className="
          flex
          h-full
          min-h-[320px]
          flex-col
          overflow-hidden
          rounded-xl
          border
          border-gray-200
          bg-white
          transition-all
          duration-300
          hover:border-gray-300
          hover:shadow-md
        "
      >
        {/* IMAGE */}

        <div
          className="
            relative
            flex
            h-[180px]
            items-center
            justify-center
            overflow-hidden
            border-b
            border-gray-100
            bg-white
            p-4
          "
        >
          <button
            type="button"
            onClick={
              handleRemove
            }
            disabled={
              isPending
            }
            className="
              absolute
              right-2
              top-2
              z-20
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              border-gray-200
              bg-white
              shadow-sm
            "
          >
            {isPending ? (
              <Loader2
                size={14}
                className="animate-spin"
              />
            ) : (
              <Trash2
                size={14}
                className="text-red-500"
              />
            )}
          </button>

          <div
            className="
              relative
              h-full
              w-full
            "
          >
            <Image
              src={image}
              alt={product.name}
              fill
              className="
                object-contain
                transition-transform
                duration-300
                group-hover:scale-105
              "
            />
          </div>
        </div>

        {/* CONTENT */}

        <div
          className="
            flex
            flex-1
            flex-col
            px-3
            py-3
          "
        >
          {!!product.brand?.name && (
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-wide
                text-gray-500
              "
            >
              {product.brand.name}
            </p>
          )}

          <h3
            className="
              line-clamp-2
              min-h-[42px]
              text-[15px]
              font-semibold
              leading-[21px]
              text-gray-900
            "
          >
            {product.name}
          </h3>

          <p
            className="
              mt-1
              line-clamp-2
              min-h-[34px]
              text-[12px]
              text-gray-500
            "
          >
            {product.shortDescription}
          </p>

          {/* RATING */}

          <div
            className="
              mt-2
              flex
              items-center
              gap-2
            "
          >
            <Star
              size={14}
              className="
                fill-yellow-400
                text-yellow-400
              "
            />

            <span
              className="
                text-xs
                font-medium
              "
            >
              {
                product.rating
                  .averageRating
              }
            </span>

            <span
              className="
                text-xs
                text-gray-400
              "
            >
              (
              {
                product.rating
                  .reviewCount
              }
              )
            </span>
          </div>

          {/* PRICE */}

          <div className="mt-auto pt-3">
            <span
              className="
                text-xl
                font-bold
                text-gray-900
              "
            >
              ₹
              {price.toLocaleString()}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}