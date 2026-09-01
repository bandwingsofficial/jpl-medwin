"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import {
  useCategoryBannerImages,
} from "@/features/banners/hooks/use-category-banner-images";
import {
  navigateToBannerLink,
} from "@/features/banners/utils/banner-navigation";
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

  const image1 = bannerImages[0];
  const image2 = bannerImages[1];
  const image3 = bannerImages[2]; // Vertical banner (900x1400)
  const image4 = bannerImages[3];
  const image5 = bannerImages[4];

  /*
   |--------------------------------------------------------------------------
   | HANDLER FOR BANNER ROUTING
   |--------------------------------------------------------------------------
   |
   */
  const handleBannerClick = (image: any) => {
    if (!image) return;
    navigateToBannerLink(image, router);
  };

  return (
    <section className="w-full px-4 py-6 md:py-10 max-w-[1400px] mx-auto space-y-6">
      {/* SECTION HEADING */}
      <div className="ml-4">
    <div className="border-l-[3px] border-[#0D9488] pl-4">
      <h2 className="text-[24px] font-bold leading-[1.25] tracking-normal md:text-[30px] xl:text-[34px]">
        <span className="text-slate-900">
          Featured {" "}
        </span>

        <span className="bg-gradient-to-r from-[#0BACAE] via-[#089981] to-[#0F8A6B] bg-clip-text text-transparent">
          Category
        </span>
      </h2>
    </div>
  </div>

      {/* MOBILE VIEW: Uncropped Images with Correct Aspect Ratios */}
      <div className="flex flex-col gap-3 sm:hidden">
        {/* Horizontal Banners 1 & 2 (1200x630 ratio) */}
        {image1 && (
          <button
            type="button"
            onClick={() => handleBannerClick(image1)}
            className="relative block w-full aspect-[1200/630] overflow-hidden rounded-[16px] text-left bg-transparent"
          >
            <Image
              src={image1.imageUrl}
              alt="Category Banner"
              fill
              priority
              className="object-contain object-center"
              sizes="100vw"
            />
          </button>
        )}

        {image2 && (
          <button
            type="button"
            onClick={() => handleBannerClick(image2)}
            className="relative block w-full aspect-[1200/630] overflow-hidden rounded-[16px] text-left bg-transparent"
          >
            <Image
              src={image2.imageUrl}
              alt="Category Banner"
              fill
              className="object-contain object-center"
              sizes="100vw"
            />
          </button>
        )}

        {/* Vertical Banner 3 (900x1400 ratio) displayed fully without cropping */}
        {image3 && (
          <button
            type="button"
            onClick={() => handleBannerClick(image3)}
            className="relative block w-full max-w-[320px] mx-auto aspect-[900/1400] overflow-hidden rounded-[16px] text-left bg-transparent my-1"
          >
            <Image
              src={image3.imageUrl}
              alt="Category Banner"
              fill
              className="object-contain object-center"
              sizes="80vw"
            />
          </button>
        )}

        {/* Horizontal Banners 4 & 5 (1200x630 ratio) in a 2-column or stacked layout */}
        <div className="grid grid-cols-2 gap-3">
          {[image4, image5].filter(Boolean).map((image) => (
            <button
              type="button"
              onClick={() => handleBannerClick(image)}
              key={image!.id}
              className="relative block w-full aspect-[1200/630] overflow-hidden rounded-[12px] text-left bg-transparent"
            >
              <Image
                src={image!.imageUrl}
                alt="Category Banner"
                fill
                className="object-contain object-center"
                sizes="50vw"
              />
            </button>
          ))}
        </div>
      </div>

      {/* DESKTOP VIEW (Untouched) */}
      <div className="hidden sm:grid grid-cols-3 gap-4">
        {/* COLUMN 1 */}
        <div className="flex flex-col gap-4">
          {[image1, image5]
            .filter(Boolean)
            .map((image) => (
              <button
                type="button"
                onClick={() => handleBannerClick(image)}
                key={image!.id}
                className="relative block w-full aspect-[21/11] overflow-hidden rounded-[20px] bg-slate-100 transition-all duration-200 hover:scale-[1.01] text-left"
              >
                <Image
                  src={image!.imageUrl}
                  alt="Category Banner"
                  fill
                  className="object-cover object-center"
                  sizes="33vw"
                />
              </button>
            ))}
        </div>

        {/* COLUMN 2 */}
        <div className="flex flex-col gap-4">
          {[image2, image4]
            .filter(Boolean)
            .map((image) => (
              <button
                type="button"
                onClick={() => handleBannerClick(image)}
                key={image!.id}
                className="relative block w-full aspect-[21/11] overflow-hidden rounded-[20px] bg-slate-100 transition-all duration-200 hover:scale-[1.01] text-left"
              >
                <Image
                  src={image!.imageUrl}
                  alt="Category Banner"
                  fill
                  className="object-cover object-center"
                  sizes="33vw"
                />
              </button>
            ))}
        </div>

        {/* COLUMN 3 */}
        <div className="flex w-full">
          {image3 && (
            <button
              type="button"
              onClick={() => handleBannerClick(image3)}
              className="relative block w-full min-h-full overflow-hidden rounded-[20px] bg-slate-100 transition-all duration-200 hover:scale-[1.01] text-left"
            >
              <Image
                src={image3.imageUrl}
                alt="Category Banner"
                fill
                className="object-cover object-center"
                sizes="33vw"
              />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}