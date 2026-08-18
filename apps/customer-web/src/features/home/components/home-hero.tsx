"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import {
  useHomeBannerImages,
} from "@/features/banners/hooks/use-home-banner-images";
import { Product } from "@/features/products/types/product.type";

export function HomeHero() {
  /*
   |--------------------------------------------------------------------------
   | DATA
   |--------------------------------------------------------------------------
   |
   */

  const router = useRouter();
  const queryClient = useQueryClient();
  const DEFAULT_BANNER = "/Images/banner.png";

  const {
    images,
    isLoading,
    isError,
  } = useHomeBannerImages();

  /*
   |--------------------------------------------------------------------------
   | SORTED IMAGES
   |--------------------------------------------------------------------------
   |
   */

  const heroImages = useMemo(
    () =>
      [...images].sort(
        (a, b) =>
          a.sortOrder -
          b.sortOrder
      ),
    [images]
  );

  /*
   |--------------------------------------------------------------------------
   | STATE
   |--------------------------------------------------------------------------
   |
   */

  const [currentIndex, setCurrentIndex] =
    useState(0);

  /*
   |--------------------------------------------------------------------------
   | MOBILE SWIPE
   |--------------------------------------------------------------------------
   */

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isSwiping = useRef(false);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];

    if (!touch) return;

    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    isSwiping.current = false;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (
      touchStartX.current === null ||
      touchStartY.current === null ||
      heroImages.length <= 1
    ) {
      touchStartX.current = null;
      touchStartY.current = null;
      return;
    }

    const touch = event.changedTouches[0];

    if (!touch) return;

    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    touchStartX.current = null;
    touchStartY.current = null;

    /*
     * Only treat the gesture as a swipe when the horizontal
     * movement is clearly greater than the vertical movement.
     * This keeps normal page scrolling working on mobile.
     */
    if (
      Math.abs(deltaX) < 50 ||
      Math.abs(deltaX) <= Math.abs(deltaY)
    ) {
      return;
    }

    isSwiping.current = true;

    if (deltaX < 0) {
      setCurrentIndex(
        (prevIndex) =>
          prevIndex === heroImages.length - 1
            ? 0
            : prevIndex + 1
      );
    } else {
      setCurrentIndex(
        (prevIndex) =>
          prevIndex === 0
            ? heroImages.length - 1
            : prevIndex - 1
      );
    }

    /*
     * Allow a normal tap again after the browser finishes
     * the touch/click sequence.
     */
    window.setTimeout(() => {
      isSwiping.current = false;
    }, 0);
  };

  /*
   |--------------------------------------------------------------------------
   | RESET INDEX
   |--------------------------------------------------------------------------
   |
   */

  useEffect(() => {
    if (
      currentIndex >
      heroImages.length - 1
    ) {
      setCurrentIndex(0);
    }
  }, [
    currentIndex,
    heroImages.length,
  ]);

  /*
   |--------------------------------------------------------------------------
   | AUTO SLIDE
   |--------------------------------------------------------------------------
   |
   */

  useEffect(() => {
    if (
      heroImages.length <= 1
    ) {
      return;
    }

    const interval =
      setInterval(() => {
        setCurrentIndex(
          (prevIndex) =>
            prevIndex ===
            heroImages.length - 1
              ? 0
              : prevIndex + 1
        );
      }, 5000);

    return () =>
      clearInterval(interval);
  }, [heroImages.length]);

  /*
   |--------------------------------------------------------------------------
   | LOADING STATE
   |--------------------------------------------------------------------------
   |
   */

  if (isLoading) {
    return (
      <section
        className="
          h-[190px]
          animate-pulse
          rounded-[16px]
          bg-gray-100

          md:h-[420px]
          md:rounded-[24px]
        "
      />
    );
  }

  /*
   |--------------------------------------------------------------------------
   | ERROR STATE
   |--------------------------------------------------------------------------
   |
   */

 if (isError) {
  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        rounded-[16px]
        bg-white
        py-3

        md:rounded-[24px]
        md:py-0
      "
    >
      <Image
        src={DEFAULT_BANNER}
        alt="Default Home Banner"
        width={1920}
        height={700}
        priority
        className="
          h-auto
          w-full
          rounded-[16px]
          object-contain

          md:rounded-[24px]
        "
      />
    </section>
  );
}

  /*
|--------------------------------------------------------------------------
| EMPTY STATE
|--------------------------------------------------------------------------
|
*/

if (heroImages.length === 0) {
  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        rounded-[16px]
        bg-white
        py-3

        md:rounded-[24px]
        md:py-0
      "
    >
      <Image
        src={DEFAULT_BANNER}
        alt="Home Banner"
        width={1920}
        height={700}
        priority
        className="
          h-auto
          w-full
          rounded-[16px]
          object-contain

          md:rounded-[24px]
        "
      />
    </section>
  );
}

  /*
   |--------------------------------------------------------------------------
   | CURRENT IMAGE
   |--------------------------------------------------------------------------
   |
   */

  const currentImage =
    heroImages[currentIndex];
  if (!currentImage) {
    return null;
  }

  /*
   |--------------------------------------------------------------------------
   | PREVIOUS IMAGE
   |--------------------------------------------------------------------------
   |
   */

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) =>
        prevIndex === 0
          ? heroImages.length - 1
          : prevIndex - 1
    );
  };

  /*
   |--------------------------------------------------------------------------
   | NEXT IMAGE
   |--------------------------------------------------------------------------
   |
   */

  const handleNext = () => {
    setCurrentIndex(
      (prevIndex) =>
        prevIndex ===
        heroImages.length - 1
          ? 0
          : prevIndex + 1
    );
  };

  /*
   |--------------------------------------------------------------------------
   | ROUTING HANDLER
   |--------------------------------------------------------------------------
   |
   */

  const handleClick = () => {
    if (isSwiping.current) {
      return;
    }

    const rawBanner = currentImage as Record<string, any>;

    if (rawBanner.productId) {
      // 1. Check if backend explicitly provided a direct slug string property
      if (rawBanner.productSlug) {
        router.push(`/products/${rawBanner.productSlug}`);
        return;
      }
      if (rawBanner.product?.slug) {
        router.push(`/products/${rawBanner.product.slug}`);
        return;
      }

      // 2. Fallback check: Read through existing global TanStack query storage keys
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

      // Fall back directly to the raw productId string if a slug match was not resolved
      const targetIdentifier = matchedSlug || rawBanner.productId;
      router.push(`/products/${targetIdentifier}`);
    }
  };

  const hasProductId = !!(currentImage as Record<string, any>).productId;

  return (
    <section
  className="
    relative
    w-full
    overflow-hidden
    rounded-[16px]
    bg-white
    px-2
    py-2

    md:mx-auto
    md:max-w-[1312px]
    md:px-4
    md:py-4
    md:rounded-[24px]
  "
>
      <div
        className="relative w-full touch-pan-y select-none md:touch-auto md:select-auto"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {hasProductId ? (
          <button
            type="button"
            onClick={handleClick}
            className="
              relative
              block
              w-full
              overflow-hidden
              text-left
            "
          >
            <Image
              src={currentImage.imageUrl}
              alt={currentImage.id}
              width={1920}
              height={700}
              priority
              className="
                h-auto
                w-full
                rounded-[16px]
                object-contain
                transition-all
                duration-500

                md:rounded-[24px]
              "
            />
          </button>
        ) : (
          <Image
            src={currentImage.imageUrl}
            alt={currentImage.id}
            width={1920}
            height={700}
            priority
            className="
              h-auto
              w-full
              rounded-[16px]
              object-contain
              transition-all
              duration-500

              md:rounded-[24px]
            "
          />
        )}

        {/* LEFT BUTTON */}

        {heroImages.length >
          1 && (
          <button
            onClick={
              handlePrevious
            }
            aria-label="
              Previous banner
            "
           className="
  absolute
  left-2
  top-1/2
  z-10
  hidden
  h-10
  w-10
  -translate-y-1/2
  items-center
  justify-center
  rounded-full
  bg-white
  shadow-md
  transition-all
  duration-200
  hover:scale-105

  md:flex
"
          >
            <svg
              xmlns="
                http://www.w3.org/2000/svg
              "
              fill="none"
              viewBox="
                0 0 24 24
              "
              strokeWidth={
                2.5
              }
              stroke="
                currentColor
              "
              className="
                h-6
                w-6
                text-gray-700
              "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="
                  M15.75
                  19.5L8.25
                  12l7.5-7.5
                "
              />
            </svg>
          </button>
        )}

        {/* RIGHT BUTTON */}

        {heroImages.length >
          1 && (
          <button
            onClick={
              handleNext
            }
            aria-label="
              Next banner
            "
            className="
              absolute
              right-4
              top-1/2
              z-10
              hidden
              h-10
              w-10
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              bg-white
              shadow-md
              transition-all
              duration-200
              hover:scale-105

              md:flex
            "
          >
            <svg
              xmlns="
                http://www.w3.org/2000/svg
              "
              fill="none"
              viewBox="
                0 0 24 24
              "
              strokeWidth={
                2.5
              }
              stroke="
                currentColor
              "
              className="
                h-6
                w-6
                text-gray-700
              "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="
                  M8.25
                  4.5L15.75
                  12l-7.5
                  7.5
                "
              />
            </svg>
          </button>
        )}

        {/* INDICATORS */}

        {heroImages.length >
          1 && (
          <div
            className="
              absolute
              bottom-3
              left-1/2
              z-10
              flex
              -translate-x-1/2
              items-center
              gap-1.5

              md:bottom-4
              md:gap-2
            "
          >
            {heroImages.map(
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
                  aria-label={`
                    Go to banner ${
                      index +
                      1
                    }
                  `}
                  className={`
                    rounded-full
                    transition-all
                    duration-300

                    ${
                      currentIndex ===
                      index
                        ? "h-2 w-5 bg-black/80 md:h-3 md:w-10"
                        : "h-2 w-2 bg-white/80 md:h-3 md:w-3"
                    }
                  `}
                />
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}