"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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

  // ADD THESE
  const isPausedRef = useRef(false);
  const mouseStartX = useRef<number | null>(null);
  const isMouseDragging = useRef(false);
  const isSwiping = useRef(false);

  // AUTO SLIDE
  useEffect(() => {
    if (images.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      if (isPausedRef.current) {
        return;
      }

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

  // ADD THIS
  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    mouseStartX.current = event.clientX;
    isMouseDragging.current = true;
    isSwiping.current = false;

    isPausedRef.current = true;
  };

  // ADD THIS
  const handleMouseUp = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (mouseStartX.current === null) {
      return;
    }

    const deltaX =
      event.clientX - mouseStartX.current;

    mouseStartX.current = null;
    isMouseDragging.current = false;

    isPausedRef.current = false;

    if (
      Math.abs(deltaX) < 50 ||
      images.length <= 1
    ) {
      return;
    }

    isSwiping.current = true;

    if (deltaX < 0) {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1
          ? 0
          : prevIndex + 1
      );
    } else {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0
          ? images.length - 1
          : prevIndex - 1
      );
    }

    window.setTimeout(() => {
      isSwiping.current = false;
    }, 0);
  };

  // ADD THIS
  const handleMouseLeave = () => {
    mouseStartX.current = null;
    isMouseDragging.current = false;

    isPausedRef.current = false;
  };

  const handleClick = () => {
    if (isSwiping.current) {
      return;
    }

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
      draggable={false}
      onDragStart={(event) =>
        event.preventDefault()
      }
      className="block h-auto w-full select-none"
      sizes="100vw"
    />
  );

  return (
    <section
      className="
        relative
        w-full
        md:cursor-grab
        md:active:cursor-grabbing
      "
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={() => {
        isPausedRef.current = true;
      }}
      onMouseLeave={handleMouseLeave}
    >
      {hasDestination ? (
        <button
          type="button"
          onClick={handleClick}
          className="
            m-0
            block
            w-full
            cursor-pointer
            select-none
            p-0
          "
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
              onClick={() =>
                setCurrentIndex(index)
              }
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