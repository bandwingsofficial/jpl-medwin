"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  useProductBannerImages,
} from "@/features/banners/hooks/use-product-banner-images";

import {
  navigateToBannerLink,
  getBannerDestination,
} from "@/features/banners/utils/banner-navigation";

interface ProductBannerProps {
  bannerIndex?: number;
}

export function ProductBanner({
  bannerIndex = 0,
}: ProductBannerProps) {
  const router = useRouter();

  const {
    images,
    isLoading,
    isError,
  } = useProductBannerImages();

  const [currentIndex, setCurrentIndex] =
    useState(bannerIndex);

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
      <div className="w-full">
        <div className="w-full animate-pulse bg-slate-100" />
      </div>
    );
  }

  if (isError || images.length === 0) {
    return null;
  }

  const banner = images[currentIndex];

  if (!banner?.imageUrl) {
    return null;
  }

  const handleClick = () => {
    navigateToBannerLink(banner, router);
  };

  const hasDestination =
    !!getBannerDestination(banner);

  const bannerImage = (
    <Image
      src={banner.imageUrl}
      alt={`Product Banner ${currentIndex + 1}`}
      width={1400}
      height={300}
      priority
      className="block h-auto w-full"
      sizes="100vw"
    />
  );

  return (
    <section className="relative w-full">
      {hasDestination ? (
        <button
          type="button"
          onClick={handleClick}
          className="m-0 block w-full cursor-pointer p-0"
        >
          {bannerImage}
        </button>
      ) : (
        bannerImage
      )}

      {images.length > 1 && (
        <div
          className="
            absolute
            bottom-3
            left-1/2
            flex
            -translate-x-1/2
            gap-2
          "
        >
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              aria-label={`Go to banner ${index + 1}`}
              onClick={() => setCurrentIndex(index)}
              className={`
                rounded-full
                transition-all
                duration-300
                ${
                  currentIndex === index
                    ? "h-2.5 w-8 bg-white"
                    : "h-2.5 w-2.5 bg-white/60"
                }
              `}
            />
          ))}
        </div>
      )}
    </section>
  );
}