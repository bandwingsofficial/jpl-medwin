"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import {
  usePromotionalBannerImages,
} from "@/features/banners/hooks/use-promotional-banner-images";
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
    const rawBanner = banner as Record<string, any>;

    if (rawBanner.productId) {
      // 1. Check if backend dynamically included slug extensions
      if (rawBanner.productSlug) {
        router.push(`/products/${rawBanner.productSlug}`);
        return;
      }
      if (rawBanner.product?.slug) {
        router.push(`/products/${rawBanner.product.slug}`);
        return;
      }

      // 2. Intercept existing products query cache to match up the slug
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

      // Fall back cleanly to the raw productId if no slug matches
      const targetIdentifier = matchedSlug || rawBanner.productId;
      router.push(`/products/${targetIdentifier}`);
    }
  };

  return (
    <section
      className="
        w-full
        max-w-[1200px]
        mx-auto
        overflow-hidden
        rounded-[20px]
      "
    >
      <button
        type="button"
        onClick={
          handleClick
        }
        disabled={
          !banner.productId
        }
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
          /* Fixed layout issue: Passed explicit sizes and removed absolute fill layout constraints */
          width={1200}
          height={300}
          priority
          className="
            w-full
            h-auto
            object-normal
            transition-transform
            duration-300
            hover:scale-[1.02]
          "
          sizes="
            (max-width: 1200px) 100vw,
            1200px
          "
        />
      </button>
    </section>
  );
}