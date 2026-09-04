"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  usePromotionalBannerImages,
} from "@/features/banners/hooks/use-promotional-banner-images";

import {
  navigateToBannerLink,
  getBannerDestination,
} from "@/features/banners/utils/banner-navigation";

interface PromotionalBannerProps {
  bannerIndex?: number;
}

export function PromotionalBanner({
  bannerIndex = 0,
}: PromotionalBannerProps) {
  const router = useRouter();

  const {
    images,
    isLoading,
    isError,
  } = usePromotionalBannerImages();

  if (isLoading) {
    return (
      <div
        className="
          mx-auto
          w-full
          max-w-5xl
          aspect-[1200/300]
          animate-pulse
          bg-slate-100
        "
      />
    );
  }

  if (isError || images.length === 0) {
    return null;
  }

  const banner =
    images[bannerIndex % images.length];

  if (!banner?.imageUrl) {
    return null;
  }

  const handleClick = () => {
    navigateToBannerLink(
      banner,
      router
    );
  };

  const hasDestination =
    !!getBannerDestination(banner);

  const image = (
    <Image
      src={banner.imageUrl}
      alt="Promotional Banner"
      width={1200}
      height={300}
      priority
      quality={95}
      unoptimized={
        typeof banner.imageUrl === "string" &&
        (
          banner.imageUrl.endsWith(".jfif") ||
          banner.imageUrl.endsWith(".webp")
        )
      }
      className="
        block
        w-full
        h-auto
      "
      sizes="
        (max-width: 1200px) 100vw,
        1200px
      "
      style={{
        filter: "contrast(1.04) saturate(1.05)",
        imageRendering:
          "-webkit-optimize-contrast" as any,
      }}
    />
  );

  return (
    <section
      className="
        mx-auto
        w-full
        max-w-5xl
      "
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
          "
        >
          {image}
        </button>
      ) : (
        image
      )}
    </section>
  );
}