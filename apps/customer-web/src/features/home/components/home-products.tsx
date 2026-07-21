"use client";

import Link from "next/link";
import Image from "next/image";

import { ProductCard } from "@/features/products/components/product-card";
import { ProductGridSkeleton } from "@/features/products/components/product-grid-skeleton";

import { useProducts } from "@/features/products/hooks/use-products";

export const HomeProducts = () => {
  const { data, isLoading } =
    useProducts({
      limit: 30,
    });

  const rawProducts =
    data?.pages?.flatMap(
      (page: any) =>
        page?.data?.data || []
    ) || [];

  const products = Array.from(
    new Map(
      rawProducts.map(
        (product: any) => [
          product.id,
          product,
        ]
      )
    ).values()
  );

  return (
    <section className="w-full pt-4">
      {/* HEADER */}
      <div
        className="
          mb-4
          flex
          items-center
          justify-between
          px-4
          sm:px-0
        "
      >
        <div>
          <div
            className="
              relative
              h-12
              w-60
              md:h-16
              md:w-80
            "
          >
            <Image
              src="/Images/products.png"
              alt="Products Banner"
              fill
              className="
                object-contain
                object-left
                scale-125
                md:scale-150
                origin-left
              "
              priority
            />
          </div>
        </div>

        <Link
          href="/products"
          className="
            hidden
            rounded-full
            border
            border-slate-200
            bg-white
            px-4
            py-2
            text-sm
            font-semibold
            text-slate-700
            transition-all
            hover:border-slate-300
            hover:bg-slate-50
            sm:block
          "
        >
         Explore More
        </Link>
      </div>

      {/* PRODUCTS */}
      {isLoading ? (
        <ProductGridSkeleton />
      ) : (
        <section className="w-full">
          <div
            className="
              grid
              grid-cols-2
              gap-3

              sm:grid-cols-3

              md:grid-cols-4

              lg:grid-cols-6

              xl:grid-cols-6

              2xl:grid-cols-6
            "
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </section>
      )}
    </section>
  );
};