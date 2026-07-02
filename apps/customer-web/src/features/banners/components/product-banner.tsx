"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import {
  useProductBannerImages,
} from "@/features/banners/hooks/use-product-banner-images";
import { Product } from "@/features/products/types/product.type";

interface ProductBannerProps {
  bannerIndex?: number;
  products?: Product[]; // Map productId to slug if passed via props
}

export function ProductBanner({
  bannerIndex = 0,
  products = [],
}: ProductBannerProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    images,
    isLoading,
    isError,
  } = useProductBannerImages();

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(
    bannerIndex
  );

  useEffect(() => {
    if (
      images.length <= 1
    ) {
      return;
    }

    const interval =
      setInterval(() => {
        setCurrentIndex(
          (prevIndex) =>
            prevIndex ===
            images.length - 1
              ? 0
              : prevIndex + 1
        );
      }, 5000);

    return () =>
      clearInterval(interval);
  }, [images.length]);

  if (isLoading) {
    return (
      <div
        className="
          h-[160px]
          w-full
          animate-pulse
          rounded-[20px]
          bg-slate-100
          md:h-[300px]
        "
      />
    );
  }

  if (isError) {
    return null;
  }

  if (
    images.length === 0
  ) {
    return null;
  }

  const banner =
    images[currentIndex];

  if (
    !banner ||
    !banner.imageUrl
  ) {
    return null;
  }

  const handleClick = () => {
    if (banner.productId) {
      // Use bracket notation with type casting to bypass the BannerImage constraint safely
      const rawBanner = banner as Record<string, any>;

      // 1. Check if the backend dynamically appended slug extensions 
      if (rawBanner.productSlug) {
        router.push(`/products/${rawBanner.productSlug}`);
        return;
      }
      if (rawBanner.product?.slug) {
        router.push(`/products/${rawBanner.product.slug}`);
        return;
      }

      // 2. Fallback check: Use explicitly provided optional component props array
      if (products && products.length > 0) {
        const matched = products.find((p) => p.id === banner.productId);
        if (matched?.slug) {
          router.push(`/products/${matched.slug}`);
          return;
        }
      }

      // 3. Fallback check: Intercept global TanStack Query cache instance to find the product
      const cachedQueries = queryClient.getQueriesData<any>({ queryKey: ["products"] });
      let matchedSlug = "";

      for (const [_, cacheData] of cachedQueries) {
        if (!cacheData) continue;

        const productList: Product[] = Array.isArray(cacheData)
          ? cacheData
          : cacheData.data?.data || cacheData.data || cacheData.products || [];

        const foundProduct = productList.find((p: any) => p && p.id === banner.productId);
        if (foundProduct?.slug) {
          matchedSlug = foundProduct.slug;
          break;
        }
      }

      // Fall back safely to product UUID if a slug string couldn't be discovered
      const targetIdentifier = matchedSlug || banner.productId;
      router.push(`/products/${targetIdentifier}`);
    }
  };

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        rounded-[20px]
      "
    >
      <button
        type="button"
        onClick={
          handleClick
        }
        className="
          relative
          block
          w-full
          overflow-hidden
          rounded-[20px]
          text-left
        "
      >
        <Image
          src={
            banner.imageUrl
          }
          alt={`Product Banner ${
            currentIndex + 1
          }`}
          width={1200}
          height={300}
          priority
          className="
            h-auto
            w-full
            object-contain
            transition-all
            duration-500
          "
          sizes="(max-width: 1200px) 100vw, 1200px"
        />
      </button>

      {images.length >
        1 && (
        <>
          {/* Indicators */}

          <div
            className="
              absolute
              bottom-4
              left-1/2
              flex
              -translate-x-1/2
              gap-2
            "
          >
            {images.map(
              (
                image,
                index
              ) => (
                <button
                  key={
                    image.id
                  }
                  onClick={() =>
                    setCurrentIndex(
                      index
                    )
                  }
                  className={`
                    rounded-full
                    transition-all
                    duration-300

                    ${
                      currentIndex ===
                      index
                        ? "h-3 w-10 bg-white"
                        : "h-3 w-3 bg-white/60"
                    }
                  `}
                />
              )
            )}
          </div>
        </>
      )}
    </section>
  );
}