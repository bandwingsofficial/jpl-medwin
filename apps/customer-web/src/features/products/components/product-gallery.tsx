"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ProductGalleryProps {
  mainImage?: string | null;

  images?: (
    | string
    | null
    | undefined
  )[];
}

const PLACEHOLDER_IMAGE =
  "/images/product-placeholder.png";

export function ProductGallery({
  mainImage,
  images = [],
}: ProductGalleryProps) {
  /*
   |----------------------------------------------------------------------
   | CLEAN + MERGE IMAGES
   |----------------------------------------------------------------------
   */

  const allImages = useMemo(() => {
    const mergedImages = [
      mainImage,
      ...images,
    ];

    const cleanedImages =
      mergedImages.filter(
        (
          image
        ): image is string =>
          typeof image === "string" &&
          image.trim().length > 0
      );

    const uniqueImages = [
      ...new Set(cleanedImages),
    ];

    return uniqueImages.length
      ? uniqueImages
      : [PLACEHOLDER_IMAGE];
  }, [mainImage, images]);

  /*
   |----------------------------------------------------------------------
   | SELECTED IMAGE
   |----------------------------------------------------------------------
   */

  const [selectedImage, setSelectedImage] =
    useState<string>(
      allImages[0]
    );

  /*
   |----------------------------------------------------------------------
   | THUMBNAIL SCROLL
   |----------------------------------------------------------------------
   */

  const thumbnailContainerRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const scrollThumbnails = (
    direction:
      | "up"
      | "down"
  ) => {
    if (
      !thumbnailContainerRef.current
    ) {
      return;
    }

    thumbnailContainerRef.current.scrollBy(
      {
        top:
          direction === "up"
            ? -120
            : 120,
        behavior: "smooth",
      }
    );
  };

  /*
   |----------------------------------------------------------------------
   | UPDATE IMAGE ON VARIANT CHANGE
   |----------------------------------------------------------------------
   */

  useEffect(() => {
    setSelectedImage(allImages[0]);
  }, [allImages]);

  /*
   |----------------------------------------------------------------------
   | IMAGE FALLBACK
   |----------------------------------------------------------------------
   */

  const handleImageError = () => {
    setSelectedImage(
      PLACEHOLDER_IMAGE
    );
  };

  return (
    <div
      className="
        flex
        flex-col-reverse
        gap-4

        md:flex-row
      "
    >
      {/* ---------------------------------------------------------------- */}
{/* THUMBNAILS */}
{/* ---------------------------------------------------------------- */}

{allImages.length > 1 && (
  <div
    className="
      flex
      gap-3

      md:h-[420px]
      md:flex-col
      md:items-center
    "
  >
    {/* UP BUTTON */}
    <button
      type="button"
      onClick={() =>
        scrollThumbnails("up")
      }
      className="
        hidden
        h-8
        w-8
        shrink-0
        items-center
        justify-center
        rounded-full
        border
        border-gray-200
        bg-white
        text-gray-600
        shadow-sm
        transition-all
        duration-200
        hover:border-gray-300
        hover:bg-gray-50

        md:flex
      "
    >
      <ChevronUp size={18} />
    </button>

    {/* THUMBNAIL LIST */}
    <div
      ref={thumbnailContainerRef}
      className="
        flex
        gap-3
        overflow-x-auto

        md:h-[340px]
        md:w-[92px]
        md:flex-1
        md:flex-col
        md:overflow-y-hidden
        md:overflow-x-hidden

        scrollbar-hide
      "
    >
      {allImages.map(
        (image, index) => {
          const isActive =
            selectedImage === image;

          return (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() =>
                setSelectedImage(
                  image
                )
              }
              className={`
                relative
                h-[82px]
                min-h-[82px]
                w-[82px]
                min-w-[82px]
                shrink-0
                overflow-hidden
                rounded-xl
                border
                bg-white
                transition-all
                duration-200

                ${
                  isActive
                    ? "border-[#0F172A] ring-2 ring-[#0F172A]/10"
                    : "border-gray-200 hover:border-gray-400"
                }
              `}
            >
              <Image
                src={
                  image ||
                  PLACEHOLDER_IMAGE
                }
                alt={`Product Thumbnail ${
                  index + 1
                }`}
                fill
                sizes="82px"
                onError={
                  handleImageError
                }
                className="
                  object-contain
                  p-2
                "
              />
            </button>
          );
        }
      )}
    </div>

    {/* DOWN BUTTON */}
    <button
      type="button"
      onClick={() =>
        scrollThumbnails("down")
      }
      className="
        hidden
        h-8
        w-8
        shrink-0
        items-center
        justify-center
        rounded-full
        border
        border-gray-200
        bg-white
        text-gray-600
        shadow-sm
        transition-all
        duration-200
        hover:border-gray-300
        hover:bg-gray-50

        md:flex
      "
    >
      <ChevronDown size={18} />
    </button>
  </div>
)}
      {/* ---------------------------------------------------------------- */}
      {/* MAIN IMAGE */}
      {/* ---------------------------------------------------------------- */}

      <div
        className="
          relative
          h-[420px]
          w-[420px]
          overflow-hidden
          rounded-2xl
          border
          border-gray-200
          bg-white
        "
      >
        <div
          className="
            relative
            mx-auto
            aspect-square
            w-full
            max-w-[520px]
          "
        >
          <Image
            src={
              selectedImage ||
              PLACEHOLDER_IMAGE
            }
            alt="Product Image"
            fill
            priority
            sizes="
              (max-width: 768px) 100vw,
              (max-width: 1200px) 45vw,
              520px
            "
            onError={
              handleImageError
            }
            className="
              object-contain
              p-6
              transition-transform
              duration-300
              hover:scale-[1.02]
            "
          />
        </div>
      </div>
    </div>
  );
}