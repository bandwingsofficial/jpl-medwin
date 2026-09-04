"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import {
  useHomeBannerImages,
} from "@/features/banners/hooks/use-home-banner-images";
import {
  navigateToBannerLink,
  getBannerDestination,
} from "@/features/banners/utils/banner-navigation";
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

    const [isPaused, setIsPaused] = useState(false);

  const isPausedRef = useRef(false);

  /*
   |--------------------------------------------------------------------------
   | MOBILE SWIPE
   |--------------------------------------------------------------------------
   */

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isSwiping = useRef(false);
// ADD THESE
const mouseStartX = useRef<number | null>(null);
const isMouseDragging = useRef(false);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];

    if (!touch) return;
    setIsPaused(true);

    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    isSwiping.current = false;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
     setIsPaused(false);
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


  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
  mouseStartX.current = event.clientX;
  isMouseDragging.current = true;
  isSwiping.current = false;

  setIsPaused(true);
  isPausedRef.current = true;
};

const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
  if (mouseStartX.current === null) return;

  const deltaX = event.clientX - mouseStartX.current;

  mouseStartX.current = null;
  isMouseDragging.current = false;

  setIsPaused(false);
  isPausedRef.current = false;

  if (
    Math.abs(deltaX) < 50 ||
    heroImages.length <= 1
  ) {
    return;
  }

  isSwiping.current = true;

  if (deltaX < 0) {
    setCurrentIndex((prevIndex) =>
      prevIndex === heroImages.length - 1
        ? 0
        : prevIndex + 1
    );
  } else {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? heroImages.length - 1
        : prevIndex - 1
    );
  }

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
  if (heroImages.length <= 1) {
    return;
  }

  const interval = setInterval(() => {
    if (isPausedRef.current) {
      return;
    }

    setCurrentIndex(
      (prevIndex) =>
        prevIndex === heroImages.length - 1
          ? 0
          : prevIndex + 1
    );
  }, 5000);

  return () => clearInterval(interval);
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
    navigateToBannerLink(currentImage, router);
  };

  const hasDestination = !!getBannerDestination(currentImage);

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
  className="relative w-full touch-pan-y select-none md:cursor-grab md:active:cursor-grabbing"
  onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd}
  onMouseDown={handleMouseDown}
  onMouseUp={handleMouseUp}
  onMouseEnter={() => {
    isPausedRef.current = true;
    setIsPaused(true);
  }}
  onMouseLeave={() => {
    mouseStartX.current = null;
    isMouseDragging.current = false;
    isPausedRef.current = false;
    setIsPaused(false);
  }}
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
              text-left
              cursor-pointer
            "
          >
            <Image
  src={currentImage.imageUrl}
  alt={currentImage.id}
  width={1920}
  height={700}
  priority
  draggable={false}
  onDragStart={(e) => e.preventDefault()}
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
  draggable={false}
  onDragStart={(e) => e.preventDefault()}
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