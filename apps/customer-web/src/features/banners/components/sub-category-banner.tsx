"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import {
  useSubCategoryBannerImages,
} from "@/features/banners/hooks/use-sub-category-banner-images";
import {
  navigateToBannerLink,
  getBannerDestination,
} from "@/features/banners/utils/banner-navigation";
import { Product } from "@/features/products/types/product.type";

interface SubCategoryBannerProps {
  bannerIndex?: number;
}

export function SubCategoryBanner({
  bannerIndex = 0,
}: SubCategoryBannerProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    images,
    isLoading,
    isError,
  } = useSubCategoryBannerImages();

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
          h-[140px]
          animate-pulse
          rounded-[20px]
          bg-slate-100

          md:h-[220px]
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
    navigateToBannerLink(currentBanner, router);
  };

  const hasDestination = !!getBannerDestination(currentBanner);

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
          max-w-5xl
          mx-auto
        "
      >
        {hasDestination ? (
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
              cursor-pointer
            "
          >
            <Image
              src={
                currentBanner.imageUrl
              }
              alt={`Sub Category Banner ${currentIndex + 1
                }`}
              width={1100}
              height={400}
              priority
              className="
                w-full
                h-auto
                object-cover
                transition-all
                duration-500
              "
              sizes="(max-width:768px) 100vw, 1100px"
            />
          </button>
        ) : (
          <div
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
              alt={`Sub Category Banner ${currentIndex + 1
                }`}
              width={1100}
              height={400}
              priority
              className="
                w-full
                h-auto
                object-cover
                transition-all
                duration-500
              "
              sizes="(max-width:768px) 100vw, 1100px"
            />
          </div>
        )}

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

                      ${currentIndex ===
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
      </div>
    </section>
  );
}