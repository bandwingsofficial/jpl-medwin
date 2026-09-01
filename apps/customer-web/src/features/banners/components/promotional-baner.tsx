"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import {
  usePromotionalBannerImages,
} from "@/features/banners/hooks/use-promotional-banner-images";
import {
  navigateToBannerLink,
  getBannerDestination,
} from "@/features/banners/utils/banner-navigation";
import { Product } from "@/features/products/types/product.type";

interface PromotionalBannerProps {
  bannerIndex?: number;
}

export function PromotionalBanner({
  bannerIndex = 0,
}: PromotionalBannerProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    images,
    isLoading,
    isError,
  } = usePromotionalBannerImages();

  if (isLoading) {
    return (
      <div
        className="
          h-[140px]
          animate-pulse
          rounded-[20px]
          bg-slate-100

          md:h-[220px]
        "
      />
    );
  }

  if (isError) {
    return null;
  }

  if (
    images.length === 0
  ) {
    return null;
  }

  const banner =
    images[
      bannerIndex %
        images.length
    ];

  if (
    !banner ||
    !banner.imageUrl
  ) {
    return null;
  }

  const handleClick = () => {
    navigateToBannerLink(banner, router);
  };

  const hasDestination = !!getBannerDestination(banner);

  return (
    <section
      className="
        w-full
        max-w-5xl
        mx-auto
        overflow-hidden
        rounded-[20px]
      "
    >
      {hasDestination ? (
        <button
          type="button"
          onClick={
            handleClick
          }
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
            src={
              banner.imageUrl
            }
            alt="Promotional Banner"
            width={1200}
            height={300}
            priority
            quality={95}
            unoptimized={
              typeof banner.imageUrl === "string" &&
              (banner.imageUrl.endsWith(".jfif") ||
                banner.imageUrl.endsWith(".webp"))
            }
            className="
              w-full
              h-auto
              object-cover
              object-center
              transition-transform
              duration-300
              hover:scale-[1.02]
            "
            sizes="
              (max-width: 1200px) 100vw,
              1200px
            "
            style={{
              filter: "contrast(1.04) saturate(1.05)",
              imageRendering: "-webkit-optimize-contrast" as any,
            }}
          />
        </button>
      ) : (
        <div
          className="
            relative
            block
            w-full
            overflow-hidden
            rounded-[20px]
            text-left
          "
        >
          <Image
            src={
              banner.imageUrl
            }
            alt="Promotional Banner"
            width={1200}
            height={300}
            priority
            quality={95}
            unoptimized={
              typeof banner.imageUrl === "string" &&
              (banner.imageUrl.endsWith(".jfif") ||
                banner.imageUrl.endsWith(".webp"))
            }
            className="
              w-full
              h-auto
              object-cover
              object-center
              transition-transform
              duration-300
            "
            sizes="
              (max-width: 1200px) 100vw,
              1200px
            "
            style={{
              filter: "contrast(1.04) saturate(1.05)",
              imageRendering: "-webkit-optimize-contrast" as any,
            }}
          />
        </div>
      )}
    </section>
  );
}