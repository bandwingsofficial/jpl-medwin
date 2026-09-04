"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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

  // ADD THESE
  const isPausedRef = useRef(false);
  const mouseStartX = useRef<number | null>(null);
  const isMouseDragging = useRef(false);
  const isSwiping = useRef(false);

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
      draggable={false}
      onDragStart={(event) =>
        event.preventDefault()
      }
      className="
        block
        w-full
        h-auto
        select-none
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
            block
            w-full
            p-0
            m-0
            border-0
            bg-transparent
            cursor-pointer
            select-none
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