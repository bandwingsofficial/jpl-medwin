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
  Search,
  Plus,
  Minus,
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

  const imageContainerRef =
    useRef<HTMLDivElement | null>(null);
  const mainImageRef =
  useRef<HTMLImageElement | null>(null);

const [imageNaturalSize, setImageNaturalSize] =
  useState({
    width: 0,
    height: 0,
  });

  const zoomHideTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const [zoomPreviewPosition, setZoomPreviewPosition] =
    useState({ top: 0, left: 0 });

  const [zoomLevel, setZoomLevel] = useState(2.5);

  /*
   |----------------------------------------------------------------------
   | SELECTED IMAGE
   |----------------------------------------------------------------------
   */

  const [selectedImage, setSelectedImage] =
    useState<string>(allImages[0]);

  const [animateImage, setAnimateImage] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isZoomVisible, setIsZoomVisible] = useState(false);

const [zoomPosition, setZoomPosition] =
  useState({
    x: 0.5,
    y: 0.5,
  });

  const showZoomPreview = () => {
    if (zoomHideTimeoutRef.current) {
      clearTimeout(zoomHideTimeoutRef.current);
      zoomHideTimeoutRef.current = null;
    }
    setIsZoomVisible(true);
  };

  const scheduleZoomHide = () => {
    if (zoomHideTimeoutRef.current) {
      clearTimeout(zoomHideTimeoutRef.current);
    }
    zoomHideTimeoutRef.current = setTimeout(() => {
      setIsZoomVisible(false);
    }, 180);
  };

  const updateZoomPreviewPosition = () => {
    const rect = imageContainerRef.current?.getBoundingClientRect();
    if (!rect || typeof window === "undefined") return;

    const panelWidth = 390;
    const panelHeight = 430;
    const gap = 18;
    const margin = 16;
    const right = rect.right + gap;
    const leftSide = rect.left - gap - panelWidth;

    const left =
      right + panelWidth <= window.innerWidth - margin
        ? right
        : Math.max(margin, leftSide);

    const preferredTop =
      rect.top + rect.height / 2 - panelHeight / 2;
    const top = Math.min(
      Math.max(margin, preferredTop),
      Math.max(margin, window.innerHeight - panelHeight - margin)
    );

    setZoomPreviewPosition({ top, left });
  };

  const changeImage = (image: string) => {
    setAnimateImage(false);
    requestAnimationFrame(() => {
      setSelectedImage(image);
      requestAnimationFrame(() => setAnimateImage(true));
    });
  };

  const handleImageMouseEnter = () => {
    updateZoomPreviewPosition();
    showZoomPreview();
  };

 const handleImageMouseMove = (
  event: React.MouseEvent<HTMLDivElement>
) => {
  const container =
    imageContainerRef.current;

  if (
    !container ||
    !imageNaturalSize.width ||
    !imageNaturalSize.height
  ) {
    return;
  }

  const rect =
    container.getBoundingClientRect();

  const computedStyle =
    window.getComputedStyle(container);

  const paddingLeft =
    Number.parseFloat(
      computedStyle.paddingLeft
    );

  const paddingRight =
    Number.parseFloat(
      computedStyle.paddingRight
    );

  const paddingTop =
    Number.parseFloat(
      computedStyle.paddingTop
    );

  const paddingBottom =
    Number.parseFloat(
      computedStyle.paddingBottom
    );

  const availableWidth =
    rect.width -
    paddingLeft -
    paddingRight;

  const availableHeight =
    rect.height -
    paddingTop -
    paddingBottom;

  const imageRatio =
    imageNaturalSize.width /
    imageNaturalSize.height;

  const containerRatio =
    availableWidth /
    availableHeight;

  let renderedWidth = availableWidth;
  let renderedHeight = availableHeight;

  if (imageRatio > containerRatio) {
    renderedHeight =
      availableWidth / imageRatio;
  } else {
    renderedWidth =
      availableHeight * imageRatio;
  }

  const imageLeft =
    rect.left +
    paddingLeft +
    (availableWidth - renderedWidth) / 2;

  const imageTop =
    rect.top +
    paddingTop +
    (availableHeight - renderedHeight) / 2;

  const x =
    (event.clientX - imageLeft) /
    renderedWidth;

  const y =
    (event.clientY - imageTop) /
    renderedHeight;

  setZoomPosition({
    x: Math.max(0, Math.min(1, x)),
    y: Math.max(0, Math.min(1, y)),
  });
};

  const getZoomBackgroundPosition = (
  position: number,
  zoom: number
) => {
  if (zoom <= 1) {
    return 50;
  }

  const normalizedPosition = position / 100;

  const backgroundPosition =
    ((normalizedPosition * zoom - 0.5) /
      (zoom - 1)) *
    100;

  return backgroundPosition;
};

  const handleImageMouseLeave = () => {
    scheduleZoomHide();
  };

  const increaseZoom = () => {
    setZoomLevel((level) =>
      Math.min(4, Number((level + 0.5).toFixed(1)))
    );
  };

  const decreaseZoom = () => {
    setZoomLevel((level) =>
      Math.max(1.5, Number((level - 0.5).toFixed(1)))
    );
  };

  useEffect(() => {
    const handleResize = () => {
      if (isZoomVisible) updateZoomPreviewPosition();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (zoomHideTimeoutRef.current) {
        clearTimeout(zoomHideTimeoutRef.current);
      }
    };
  }, [isZoomVisible]);

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
    ${
      isZoomVisible
        ? "z-[9999]"
        : "z-0"
    }
    ${
      allImages.length <= 1
        ? "md:h-[360px] md:flex-1"
        : "md:h-[360px] md:w-[360px]"
    }
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
  ref={imageContainerRef}
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

     {isZoomVisible &&
  typeof document !== "undefined" &&
  createPortal(
    <div
      className="fixed z-[999999] hidden md:block"
      style={{
        top: `${zoomPreviewPosition.top}px`,
        left: `${zoomPreviewPosition.left}px`,
      }}
      onMouseEnter={showZoomPreview}
      onMouseLeave={scheduleZoomHide}
    >
      <div
        className="
          relative w-[390px] overflow-visible rounded-[26px]
          border border-[#9ce7de] bg-[#dff7f2] p-2
          shadow-[0_18px_45px_rgba(21,128,116,0.20)]
        "
      >
        <div
          className="
            flex h-[38px] items-center justify-between rounded-t-[18px]
            border-b border-[#bdece5] bg-[#ecfbf8] px-3
          "
        >
          <div className="flex items-center gap-2">
            <Search size={14} strokeWidth={2} className="text-[#168d82]" />
            <span className="text-[11px] font-medium text-slate-600">
              Zoom View
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] font-semibold text-slate-500">
              {zoomLevel.toFixed(1)}×
            </span>
            <button
              type="button"
              aria-label="Close zoom preview"
              onClick={() => setIsZoomVisible(false)}
              className="
                flex h-6 w-6 items-center justify-center rounded-full
                text-slate-500 transition-colors hover:bg-[#d5f2ec]
              "
            >
              <X size={15} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        <div
          className="
            relative flex h-[374px] items-center justify-center
            overflow-visible rounded-b-[18px]
            bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.92)_0%,rgba(222,247,241,0.95)_58%,rgba(191,237,228,0.90)_100%)]
          "
        >
          <div
            className="
              relative h-[340px] w-[340px] overflow-hidden rounded-full
              border border-[#83d8cf] bg-white
              shadow-[0_12px_30px_rgba(21,128,116,0.12)]
            "
          >
            <div
              className="h-full w-full bg-white bg-no-repeat"
              style={{
  backgroundImage: `url("${selectedImage || PLACEHOLDER_IMAGE}")`,
  backgroundSize: `${zoomLevel * 100}% ${zoomLevel * 100}%`,
  backgroundPosition: `
    ${getZoomBackgroundPosition(
      zoomPosition.x,
      zoomLevel
    )}%
    ${getZoomBackgroundPosition(
      zoomPosition.y,
      zoomLevel
    )}%
  `,
}}
            />
            <div
              className="
                pointer-events-none absolute inset-0 rounded-full
                ring-1 ring-inset ring-white/50
              "
            />
          </div>

          <div
            className="
              absolute right-[-22px] top-1/2 z-20 flex w-[50px]
              -translate-y-1/2 flex-col overflow-hidden rounded-[20px]
              border border-[#cde6e2] bg-white
              shadow-[0_10px_25px_rgba(15,23,42,0.14)]
            "
          >
            <button
              type="button"
              aria-label="Increase zoom"
              onClick={increaseZoom}
              disabled={zoomLevel >= 4}
              className="
                flex h-[48px] items-center justify-center border-b
                border-slate-100 text-slate-500 transition-colors
                hover:bg-[#effbf8] hover:text-[#168d82]
                disabled:cursor-not-allowed disabled:opacity-40
              "
            >
              <Plus size={19} strokeWidth={1.8} />
            </button>

            <div
              className="
                flex h-[44px] items-center justify-center text-[11px]
                font-semibold text-slate-500
              "
            >
              {zoomLevel.toFixed(1)}×
            </div>

            <button
              type="button"
              aria-label="Decrease zoom"
              onClick={decreaseZoom}
              disabled={zoomLevel <= 1.5}
              className="
                flex h-[48px] items-center justify-center border-t
                border-slate-100 text-slate-500 transition-colors
                hover:bg-[#effbf8] hover:text-[#168d82]
                disabled:cursor-not-allowed disabled:opacity-40
              "
            >
              <Minus size={19} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
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