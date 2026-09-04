"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  useSubCategoryBannerImages,
} from "@/features/banners/hooks/use-sub-category-banner-images";

import {
  navigateToBannerLink,
  getBannerDestination,
} from "@/features/banners/utils/banner-navigation";

interface SubCategoryBannerProps {
  bannerIndex?: number;
}

export function SubCategoryBanner({
  bannerIndex = 0,
}: SubCategoryBannerProps) {
  const router = useRouter();

  const {
    images,
    isLoading,
    isError,
  } = useSubCategoryBannerImages();

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(bannerIndex);

  useEffect(() => {
    if (images.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1
          ? 0
          : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (isLoading) {
    return (
      <div
        className="
          mx-auto
          w-full
          max-w-[1100px]
          aspect-[1100/400]
          animate-pulse
          bg-slate-100
        "
      />
    );
  }

  if (isError || images.length === 0) {
    return null;
  }

  const currentBanner =
    images[currentIndex];

  if (
    !currentBanner?.imageUrl
  ) {
    return null;
  }

  const handleClick = () => {
    navigateToBannerLink(
      currentBanner,
      router
    );
  };

  const hasDestination =
    !!getBannerDestination(
      currentBanner
    );

  const image = (
    <Image
      src={currentBanner.imageUrl}
      alt={`Sub Category Banner ${
        currentIndex + 1
      }`}
      width={1100}
      height={400}
      priority
      className="
        block
        w-full
        h-auto
      "
      sizes="
        (max-width: 1100px) 100vw,
        1100px
      "
    />
  );

  return (
    <section
      className="
        relative
        mx-auto
        w-full
        max-w-[1100px]
      "
    >
      {hasDestination ? (
        <button
          type="button"
          onClick={handleClick}
          className="
            block
            w-full
            p-0
            m-0
            border-0
            bg-transparent
            cursor-pointer
          "
        >
          {image}
        </button>
      ) : (
        image
      )}

      {images.length > 1 && (
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
            (image, index) => (
              <button
                key={image.id}
                type="button"
                aria-label={`Go to banner ${
                  index + 1
                }`}
                onClick={() =>
                  setCurrentIndex(index)
                }
                className={`
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    currentIndex === index
                      ? "h-3 w-10 bg-white"
                      : "h-3 w-3 bg-white/60"
                  }
                `}
              />
            )
          )}
        </div>
      )}
    </section>
  );
}