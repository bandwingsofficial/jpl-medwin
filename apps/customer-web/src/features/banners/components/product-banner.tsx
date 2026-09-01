"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import {
  useProductBannerImages,
} from "@/features/banners/hooks/use-product-banner-images";
import {
  navigateToBannerLink,
  getBannerDestination,
} from "@/features/banners/utils/banner-navigation";
import { Product } from "@/features/products/types/product.type";

interface ProductBannerProps {
  bannerIndex?: number;
  products?: Product[];
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
          mx-auto
          h-[140px]
          w-full
          max-w-4xl
          animate-pulse
          rounded-[20px]
          bg-slate-100
          sm:h-[200px]
          md:h-[240px]
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
    navigateToBannerLink(banner, router);
  };

  const hasDestination = !!getBannerDestination(banner);

  return (
    <section
      className="
        relative
        mx-auto
        w-full
        max-w-6xl
        overflow-hidden
        rounded-[20px]
        px-4
      "
    >
      {hasDestination ? (
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
            text-center
            cursor-pointer
          "
        >
          {/* Aspect-ratio container to keep sizes controlled and neat across screen sizes */}
          <div 
            className="
              relative 
              h-[140px] 
              w-full 
              sm:h-[200px] 
              md:h-[240px]
            "
          >
            <Image
              src={
                banner.imageUrl
              }
              alt={`Product Banner ${
                currentIndex + 1
              }`}
              fill
              priority
              className="
                object-cover
                transition-all
                duration-500
              "
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        </button>
      ) : (
        <div
          className="
            relative
            block
            w-full
            overflow-hidden
            rounded-[20px]
            text-center
          "
        >
          <div 
            className="
              relative 
              h-[140px] 
              w-full 
              sm:h-[200px] 
              md:h-[240px]
            "
          >
            <Image
              src={
                banner.imageUrl
              }
              alt={`Product Banner ${
                currentIndex + 1
              }`}
              fill
              priority
              className="
                object-cover
                transition-all
                duration-500
              "
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        </div>
      )}

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
                        ? "h-2.5 w-8 bg-white"
                        : "h-2.5 w-2.5 bg-white/60"
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