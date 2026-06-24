"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import {
  useCategoryBannerImages,
} from "@/features/banners/hooks/use-category-banner-images";
import { Product } from "@/features/products/types/product.type";

export function HomeCategoriespromo() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    images,
    isLoading,
    isError,
  } = useCategoryBannerImages();

  if (isLoading) {
    return (
      <section className="w-full px-4 py-6 md:py-10 max-w-[1400px] mx-auto">
        <div className="h-[400px] animate-pulse rounded-[20px] bg-slate-100" />
      </section>
    );
  }

  if (isError) {
    return null;
  }

  if (images.length === 0) {
    return null;
  }

  const bannerImages = [...images]
    .sort(
      (a, b) =>
        a.sortOrder -
        b.sortOrder
    )
    .slice(0, 5);

  const image1 =
    bannerImages[0];

  const image2 =
    bannerImages[1];

  const image3 =
    bannerImages[2];

  const image4 =
    bannerImages[3];

  const image5 =
    bannerImages[4];

  /*
   |--------------------------------------------------------------------------
   | HANDLER FOR SLUG-BASED ROUTING
   |--------------------------------------------------------------------------
   */
  const handleBannerClick = (image: any) => {
    if (!image) return;

    const rawBanner = image as Record<string, any>;

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

      // Fall back safely to the raw productId if no slug matches
      const targetIdentifier = matchedSlug || rawBanner.productId;
      router.push(`/products/${targetIdentifier}`);
    }
  };

  return (
    <section className="w-full px-4 py-6 md:py-10 max-w-[1400px] mx-auto">
      {/* SECTION HEADING */}

      <div className="relative h-12 w-60 md:h-16 md:w-80 pb-4">
        <Image
          src="/Images/Featured.png"
          alt="Featured Categories"
          fill
          priority
          className="
            object-contain
            object-left
            scale-125
            md:scale-150
            origin-left
          "
        />
      </div>

      {/* MOBILE */}

      <div className="flex flex-col gap-3 sm:hidden">
        {image1 && (
          <button
            type="button"
            onClick={() => handleBannerClick(image1)}
            className="
              relative
              block
              w-full
              aspect-[21/11]
              overflow-hidden
              rounded-[16px]
              bg-slate-100
              shadow-sm
              text-left
            "
          >
            <Image
              src={
                image1.imageUrl
              }
              alt="Category Banner"
              fill
              priority
              className="
                object-cover
                object-center
              "
              sizes="100vw"
            />
          </button>
        )}

        <div className="grid grid-cols-2 gap-3">
          {[image2, image3, image4, image5]
            .filter(Boolean)
            .map(
              (image) => (
                <button
                  type="button"
                  onClick={() => handleBannerClick(image)}
                  key={
                    image!.id
                  }
                  className="
                    relative
                    block
                    aspect-square
                    overflow-hidden
                    rounded-[16px]
                    bg-slate-100
                    shadow-sm
                    text-left
                  "
                >
                  <Image
                    src={
                      image!
                        .imageUrl
                    }
                    alt="Category Banner"
                    fill
                    className="
                      object-cover
                      object-center
                    "
                    sizes="50vw"
                  />
                </button>
              )
            )}
        </div>
      </div>

      {/* DESKTOP */}

      <div className="hidden sm:grid grid-cols-3 gap-4">
        {/* COLUMN 1 */}

        <div className="flex flex-col gap-4">
          {[image1, image5]
            .filter(Boolean)
            .map(
              (image) => (
                <button
                  type="button"
                  onClick={() => handleBannerClick(image)}
                  key={
                    image!.id
                  }
                  className="
                    relative
                    block
                    w-full
                    aspect-[21/11]
                    overflow-hidden
                    rounded-[20px]
                    bg-slate-100
                    transition-all
                    duration-200
                    hover:scale-[1.01]
                    text-left
                  "
                >
                  <Image
                    src={
                      image!
                        .imageUrl
                    }
                    alt="Category Banner"
                    fill
                    className="
                      object-cover
                      object-center
                    "
                    sizes="33vw"
                  />
                </button>
              )
            )}
        </div>

        {/* COLUMN 2 */}

        <div className="flex flex-col gap-4">
          {[image2, image4]
            .filter(Boolean)
            .map(
              (image) => (
                <button
                  type="button"
                  onClick={() => handleBannerClick(image)}
                  key={
                    image!.id
                  }
                  className="
                    relative
                    block
                    w-full
                    aspect-[21/11]
                    overflow-hidden
                    rounded-[20px]
                    bg-slate-100
                    transition-all
                    duration-200
                    hover:scale-[1.01]
                    text-left
                  "
                >
                  <Image
                    src={
                      image!
                        .imageUrl
                    }
                    alt="Category Banner"
                    fill
                    className="
                      object-cover
                      object-center
                    "
                    sizes="33vw"
                  />
                </button>
              )
            )}
        </div>

        {/* COLUMN 3 */}

        <div className="flex w-full">
          {image3 && (
            <button
              type="button"
              onClick={() => handleBannerClick(image3)}
              className="
                relative
                block
                w-full
                min-h-full
                overflow-hidden
                rounded-[20px]
                bg-slate-100
                transition-all
                duration-200
                hover:scale-[1.01]
                text-left
              "
            >
              <Image
                src={
                  image3.imageUrl
                }
                alt="Category Banner"
                fill
                className="
                  object-cover
                  object-center
                "
                sizes="33vw"
              />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}