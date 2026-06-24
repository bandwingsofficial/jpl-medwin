"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import {
  usePromotionalBannerImages,
} from "@/features/banners/hooks/use-promotional-banner-images";

export function PromotionalBannerCarousel() {
  const {
    images,
    isLoading,
    isError,
  } =
    usePromotionalBannerImages();

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  useEffect(() => {
    if (
      images.length <= 1
    ) {
      return;
    }

    const interval =
      setInterval(() => {
        setCurrentIndex(
          (prev) =>
            prev ===
            images.length - 1
              ? 0
              : prev + 1
        );
      }, 5000);

    return () =>
      clearInterval(interval);
  }, [images.length]);

  if (
    isLoading ||
    isError ||
    images.length === 0
  ) {
    return null;
  }

  const banner =
    images[currentIndex];

  return (
    <div
      className="
        relative
        w-full
        /* STRICT FIX: Locks the banner width exactly to 1200px so Next.js never stretches or zooms it */
        max-w-[1200px]
        /* Keeps the 1200px banner perfectly aligned in the middle of the page */
        mx-auto
        overflow-hidden
        rounded-[20px]
      "
    >
      <Image
        src={banner.imageUrl}
        alt="
          Promotional Banner
        "
        /* True native scale blueprint dimensions */
        width={1200}
        height={300}
        priority
        className="
          w-full
          h-auto
          object-normal
        "
        sizes="
          (max-width: 1200px) 100vw,
          1200px
        "
      />
    </div>
  );
}