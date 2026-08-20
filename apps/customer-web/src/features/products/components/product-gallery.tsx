"use client";
import { Loader2 } from "lucide-react";

import { useWishlist } from "@/features/wishlist/hooks/use-wishlist";
import { useAddToWishlist } from "@/features/wishlist/hooks/use-add-to-wishlist";
import { useRemoveFromWishlist } from "@/features/wishlist/hooks/use-remove-from-wishlist";

import { useAuthGuard } from "@/features/auth/hooks/use-auth-guard";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Product } from "@/features/products/types/product.type";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Heart,
   X,
  Share2,
} from "lucide-react";

interface ProductGalleryProps {
  product: Product;

  mainImage?: string | null;

  images?: (
    | string
    | null
    | undefined
  )[];
}

const PLACEHOLDER_IMAGE = '/Logo/jpl_logo.png';

export function ProductGallery({
  product,
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

    const [animateImage, setAnimateImage] = useState(false);
    const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
    const [isZoomVisible, setIsZoomVisible] = useState(false);

const [zoomPosition, setZoomPosition] = useState({
  x: 50,
  y: 50,
});

const changeImage = (image: string) => {
  setAnimateImage(false);

  requestAnimationFrame(() => {
    setSelectedImage(image);

    requestAnimationFrame(() => {
      setAnimateImage(true);
    });
  });
};

const handleImageMouseEnter = () => {
  setIsZoomVisible(true);
};

const handleImageMouseMove = (
  event: React.MouseEvent<HTMLDivElement>
) => {
  const rect = event.currentTarget.getBoundingClientRect();

  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  setZoomPosition({
    x: Math.max(0, Math.min(100, x)),
    y: Math.max(0, Math.min(100, y)),
  });
};

const handleImageMouseLeave = () => {
  setIsZoomVisible(false);
};

const currentImageIndex = Math.max(
  allImages.indexOf(selectedImage),
  0
);

const showPreviousImage = () => {
  const previousIndex =
    currentImageIndex === 0
      ? allImages.length - 1
      : currentImageIndex - 1;

  changeImage(allImages[previousIndex]);
};

const showNextImage = () => {
  const nextIndex =
    currentImageIndex === allImages.length - 1
      ? 0
      : currentImageIndex + 1;

  changeImage(allImages[nextIndex]);
};
  /*
   |----------------------------------------------------------------------
   | WISHLIST & SHARE STATES
   |----------------------------------------------------------------------
   */

 const [isCopied,
    setIsCopied] =
  useState(false);

const { requireAuth } =
  useAuthGuard();

const {
  wishlistIds,
} = useWishlist();

const {
  mutateAsync:
    addToWishlist,
  isPending:
    isAddingWishlist,
} =
  useAddToWishlist();

const {
  mutateAsync:
    removeFromWishlist,
  isPending:
    isRemovingWishlist,
} =
  useRemoveFromWishlist();

const isWishlisted =
  wishlistIds?.has(
    product.id
  ) ?? false;

const isWishlistLoading =
  isAddingWishlist ||
  isRemovingWishlist;

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

  useEffect(() => {
  changeImage(allImages[0]);
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

  /*
   |----------------------------------------------------------------------
   | SHARE EXECUTION HANDLER
   |----------------------------------------------------------------------
   */

  const handleShare = async () => {
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this product on JPL Medwin",
          url: currentUrl,
        });
      } catch (err) {
        console.error("Error sharing product:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(currentUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };
  const handleWishlist = async (
  e: React.MouseEvent<HTMLButtonElement>
) => {
  e.preventDefault();
  e.stopPropagation();

  try {
    if (isWishlisted) {
      await removeFromWishlist(product.id);
      return;
    }

    await addToWishlist(product);
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div
      className="
        flex
        w-full
        flex-col-reverse
        gap-4
        md:flex-row
        md:items-start
      "
    >
      {/* ---------------------------------------------------------------- */}
      {/* THUMBNAILS */}
      {/* ---------------------------------------------------------------- */}

      {allImages.length > 1 && (
        <div
          className="
            flex
            w-full
            gap-3
            overflow-x-auto
            md:h-[360px]
            md:w-auto
            md:flex-col
            md:items-center
            md:overflow-x-visible
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
              md:h-[280px]
              md:w-[80px]
              md:flex-1
              md:flex-col
              md:overflow-y-auto
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
                    onClick={() => changeImage(image)}
                    className={`
                      relative
                      h-[64px]
                      min-h-[64px]
                      w-[64px]
                      min-w-[64px]
                      shrink-0
                      overflow-hidden
                      rounded-xl
                      border
                      bg-white
                      transition-all
                      duration-200
                      md:h-[72px]
                      md:min-h-[72px]
                      md:w-[72px]
                      md:min-w-[72px]

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
                      sizes="72px"
                      onError={
                        handleImageError
                      }
                      className="
                        object-contain
                        p-1.5
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
      {/* MAIN IMAGE WITH TOP-RIGHT WISHLIST + SHARE FLOATING BUTTONS */}
      {/* ---------------------------------------------------------------- */}

      <div
        className={`
          relative
          w-full
         overflow-visible
          rounded-2xl
          border
          border-gray-200
          bg-white
          h-[320px]
          sm:h-[360px]
          ${allImages.length <= 1 ? "md:h-[360px] md:flex-1" : "md:h-[360px] md:w-[360px]"}
        `}
      >
        {/* INTERACTIVE FLOATING UTILITY COLUMN */}
        <div className="absolute right-4 top-4 z-20 flex flex-col gap-2.5">
          {/* WISHLIST TRIGGER ACTION */}
          <button
           type="button"
           onClick={handleWishlist}
           disabled={isWishlistLoading}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-gray-100
              bg-white
              text-gray-600
              shadow-[0_2px_8px_rgba(0,0,0,0.04)]
              transition-all
              duration-200
              hover:scale-105
              active:scale-95
            "
          >
            {isWishlistLoading ? (
 <Loader2
   size={19}
   className="animate-spin"
 />
) : (
 <Heart
   size={19}
   className={`transition-colors duration-200 ${
     isWishlisted
       ? "fill-red-500 text-red-500"
       : "text-gray-500 hover:text-red-500"
   }`}
 />
)}
          </button>

          {/* SHARE TRIGGER ACTION */}
          <div className="relative flex items-center justify-center">
            <button
              type="button"
              onClick={handleShare}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                border
                border-gray-100
                bg-white
                text-gray-500
                shadow-[0_2px_8px_rgba(0,0,0,0.04)]
                transition-all
                duration-200
                hover:scale-105
                hover:text-blue-600
                active:scale-95
              "
            >
              <Share2 size={18} />
            </button>

            {/* FALLBACK COPIED NOTIFICATION TIP */}
            {isCopied && (
              <span className="absolute right-11 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[11px] font-medium text-white shadow-sm">
                Link Copied!
              </span>
            )}
          </div>
        </div>

        <div
  className="
    group
    relative
    mx-auto
    flex
    h-full
    w-full
    cursor-zoom-in
    items-center
    justify-center
    overflow-hidden
    rounded-2xl
  "
  onClick={() => setIsImagePopupOpen(true)}
  onMouseEnter={handleImageMouseEnter}
  onMouseMove={handleImageMouseMove}
  onMouseLeave={handleImageMouseLeave}
>
  <Image
  key={selectedImage}
  src={selectedImage || PLACEHOLDER_IMAGE}
  alt="Product Image"
  fill
  priority
  sizes="
    (max-width: 768px) 100vw,
    (max-width: 1200px) 50vw,
    360px
  "
  onError={handleImageError}
  className={`
    object-contain
    p-4
    sm:p-6
    transition-all
    duration-300
    ease-out
    hover:scale-[1.02]
    ${
      animateImage
        ? "scale-100 opacity-100"
        : "scale-75 opacity-0"
    }
  `}
/>
        </div>

      {/* HOVER ZOOM PREVIEW - OUTSIDE THE IMAGE OVERFLOW CONTAINER */}
      {isZoomVisible && (
        <div
          className="
            pointer-events-none
            absolute
            left-[calc(100%+16px)]
            top-1/2
            z-[999]
            hidden
            h-[340px]
            w-[340px]
            -translate-y-1/2
            overflow-hidden
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-[0_12px_35px_rgba(0,0,0,0.16)]
            md:block
          "
        >
          <div
            className="
              h-full
              w-full
              bg-white
              bg-no-repeat
            "
            style={{
              backgroundImage: `url("${selectedImage || PLACEHOLDER_IMAGE}")`,
              backgroundSize: "250% 250%",
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
            }}
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              rounded-2xl
              ring-1
              ring-inset
              ring-black/5
            "
          />
        </div>
      )}

           {isImagePopupOpen &&
  typeof document !== "undefined" &&
  createPortal(
    <div
      className="
        fixed
        inset-0
        z-[999999]
        flex
        items-center
        justify-center
        bg-black/70
        p-4
      "
      onClick={() => setIsImagePopupOpen(false)}
    >
      {/* WHITE SQUARE POPUP */}
      <div
  className="
    relative
    flex
    h-[460px]
    w-[460px]
    max-h-[90vh]
    max-w-[90vw]
    flex-col
    overflow-hidden
    rounded-2xl
    bg-white
    shadow-2xl

    sm:h-[500px]
    sm:w-[500px]

    md:h-[600px]
    md:w-[600px]
  "
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* CLOSE BUTTON */}
        <button
          type="button"
          aria-label="Close image"
          onClick={() =>
            setIsImagePopupOpen(false)
          }
          className="
            absolute
            right-3
            top-3
            z-50
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-white
            text-gray-700
            shadow-md
            transition-all
            duration-200
            hover:scale-105
            hover:bg-gray-100
            active:scale-95
          "
        >
          <X size={20} />
        </button>

        {/* MAIN IMAGE AREA */}
        <div
          className="
            relative
            flex
            min-h-0
            flex-1
            items-center
            justify-center
            px-12
            py-6
          "
        >
          {/* LEFT ARROW */}
          {allImages.length > 1 && (
            <button
              type="button"
              aria-label="Previous image"
              onClick={showPreviousImage}
              className="
                absolute
                left-3
                top-1/2
                z-30
                flex
                h-10
                w-10
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-white
                text-gray-700
                shadow-md
                transition-all
                duration-200
                hover:scale-105
                hover:bg-gray-100
                active:scale-95
              "
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* MAIN IMAGE */}
          <div className="relative h-full w-full">
            <Image
              key={selectedImage}
              src={
                selectedImage ||
                PLACEHOLDER_IMAGE
              }
              alt="Product Image Fullscreen"
              fill
              priority
              sizes="600px"
              className="
                object-contain
                p-4
              "
            />
          </div>

          {/* RIGHT ARROW */}
          {allImages.length > 1 && (
            <button
              type="button"
              aria-label="Next image"
              onClick={showNextImage}
              className="
                absolute
                right-3
                top-1/2
                z-30
                flex
                h-10
                w-10
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-white
                text-gray-700
                shadow-md
                transition-all
                duration-200
                hover:scale-105
                hover:bg-gray-100
                active:scale-95
              "
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>

        {/* BOTTOM IMAGE THUMBNAILS */}
        {allImages.length > 1 && (
          <div
            className="
              flex
              h-[100px]
              shrink-0
              items-center
              justify-center
              gap-3
              overflow-x-auto
              border-t
              border-gray-100
              bg-white
              px-4
              py-3
              scrollbar-hide
            "
          >
            {allImages.map(
              (image, index) => {
                const isActive =
                  selectedImage === image;

                return (
                  <button
                    key={`popup-${image}-${index}`}
                    type="button"
                    aria-label={`View image ${
                      index + 1
                    }`}
                    onClick={() =>
                      changeImage(image)
                    }
                    className={`
                      relative
                      h-[68px]
                      w-[68px]
                      shrink-0
                      overflow-hidden
                      rounded-lg
                      border-2
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
                      alt={`Product image ${
                        index + 1
                      }`}
                      fill
                      sizes="68px"
                      className="
                        object-contain
                        p-1
                      "
                    />
                  </button>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  )}
      </div>
    </div>
  );
}