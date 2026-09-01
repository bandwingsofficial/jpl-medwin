"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  usePromotionalBannerImages,
} from "@/features/banners/hooks/use-promotional-banner-images";
import {
  navigateToBannerLink,
  getBannerDestination,
} from "@/features/banners/utils/banner-navigation";

export function PromotionalBannerCarousel() {
  const router = useRouter();
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

  if (!banner) {
    return null;
  }

  const hasDestination = !!getBannerDestination(banner);

  const handleClick = () => {
    navigateToBannerLink(banner, router);
  };

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
            src={banner.imageUrl}
            alt="Promotional Banner"
            width={1200}
            height={300}
            priority
            className="
              w-full
              h-auto
              object-cover
              transition-transform
              duration-300
              hover:scale-[1.01]
            "
            sizes="
              (max-width: 1200px) 100vw,
              1200px
            "
          />
        </button>
      ) : (
        <Image
          src={banner.imageUrl}
          alt="Promotional Banner"
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
      )}
    </div>
  );
}