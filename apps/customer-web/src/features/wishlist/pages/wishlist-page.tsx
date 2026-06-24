"use client";

import { Heart } from "lucide-react";

import { useWishlist } from "@/features/wishlist/hooks/use-wishlist";

import { WishlistGrid } from "@/features/wishlist/components/wishlist-grid";

import { WishlistEmpty } from "@/features/wishlist/components/wishlist-empty";

import { WishlistSkeleton } from "@/features/wishlist/components/wishlist-skeleton";

export function WishlistPage() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useWishlist();
  const items =
    data?.items ?? [];

  const totalItems =
    data?.totalItems ?? 0;

  if (isLoading) {
    return (
      <WishlistSkeleton />
    );
  }

  if (isError) {
    return (
      <div
        className="
          flex
          min-h-[300px]
          items-center
          justify-center
          text-center
        "
      >
        <div>
          <h2
            className="
              text-lg
              font-semibold
              text-red-600
            "
          >
            Failed to load wishlist
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-gray-500
            "
          >
            {error?.message}
          </p>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return <WishlistEmpty />;
  }

  return (
    <section
      className="
        mx-auto
        w-full
        max-w-[1440px]
        px-4
        py-6

        sm:px-6

        lg:px-8
      "
    >
      {/* HEADER */}

      <div
        className="
          mb-8
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
        "
      >
        <div
          className="
            flex
            items-center
            gap-4
          "
        >
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-rose-50
            "
          >
            <Heart
              size={28}
              className="
                fill-rose-500
                text-rose-500
              "
            />
          </div>

          <div>
            <h1
              className="
                text-2xl
                font-bold
                text-slate-900

                md:text-3xl
              "
            >
              My Wishlist
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              {totalItems}
              {" "}
              saved product
              {totalItems !== 1
                ? "s"
                : ""}
            </p>
          </div>
        </div>
      </div>

      {/* PRODUCTS */}

      <WishlistGrid
        items={items}
      />
    </section>
  );
}