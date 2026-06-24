"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import {
  useSubCategoryBannerImages,
} from "@/features/banners/hooks/use-sub-category-banner-images";
import { Product } from "@/features/products/types/product.type";

export function SubCategoryBanner() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    images,
    isLoading,
    isError,
  } =
    useSubCategoryBannerImages();

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  useEffect(() => {
    if (images.length <= 1) {
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
          h-[180px]
          animate-pulse
          rounded-[20px]
          bg-slate-100

          md:h-[260px]
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

  const currentBanner =
    images[currentIndex];

  if (!currentBanner) {
    return null;
  }

  const handleClick = () => {
    const rawBanner = currentBanner as Record<string, any>;

    if (rawBanner.productId) {
      // 1. Check if backend dynamically included slug extensions
      if (rawBanner.productSlug) {
        router.push(`/products/${rawBanner.productSlug}`);
        return;
      }
      if (rawBanner.product?.slug) {
        router.push(`/products/${rawBanner.product.slug}`);
        return;
      }

      // 2. Intercept existing products query cache to match up the slug
      const cachedQueries = queryClient.getQueriesData<any>({ queryKey: ["products"] });
      let matchedSlug = "";

      for (const [_, cacheData] of cachedQueries) {
        if (!cacheData) continue;

        const productList: Product[] = Array.isArray(cacheData)
          ? cacheData
          : cacheData.data?.data || cacheData.data || cacheData.products || [];

        const foundProduct = productList.find((p: any) => p && p.id === rawBanner.productId);
        if (foundProduct?.slug) {
          matchedSlug = foundProduct.slug;
          break;
        }
      }

      // Fall back cleanly to the raw productId if no slug matches
      const targetIdentifier = matchedSlug || rawBanner.productId;
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
      <div
        className="
          relative
          w-full
          /* Restricts stretching beyond the 1100px width + 150px tolerance limit */
          max-w-[1250px]
          mx-auto
        "
      >
        <button
          type="button"
          onClick={handleClick}
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
              currentBanner.imageUrl
            }
            alt={`Sub Category Banner ${
              currentIndex + 1
            }`}
            /* Replaced 'fill' with exact 1100x400 native size to stop internal zooming/stretching */
            width={1100}
            height={400}
            priority
            className="
              w-full
              h-auto
              object-normal
              transition-all
              duration-500
            "
            sizes="
              (max-width:768px)
              100vw,
              1100px
            "
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
      </div>
    </section>
  );
}