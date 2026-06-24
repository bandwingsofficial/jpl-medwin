"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

import { useBrands } from "@/features/brands/hooks/use-brands";

// Using a NAMED export here
export function HomeBrands() {
  const {
    data: brands,
    isLoading,
    isError,
  } = useBrands();

  if (isLoading)
    return (
      <div className="h-32 animate-pulse rounded-2xl bg-gray-100" />
    );

  if (isError) return null;

  return (
    <section className="space-y-4">
      {/* GLOBAL MARQUEE & PREMIUM SHINING BORDER STYLES */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 25s linear infinite;
            }
            .animate-marquee:hover {
              animation-play-state: paused;
            }

            /* Shining Magic Border Rotation */
            @keyframes rotate-gradient {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .shining-border-wrapper {
              position: relative;
              background: rgba(255, 255, 255, 0.8);
              padding: 1px; /* The width of the shining border */
              overflow: hidden;
            }
            .shining-border-wrapper::before {
              content: '';
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              /* Premium color palette: Teal, Cyan, Deep Navy Accent, and Luxury Gold highlights */
              background: conic-gradient(
                from 0deg,
                transparent 20%,
                #0d9488 35%,
                #2dd4bf 45%,
                transparent 55%,
                transparent 70%,
                #001f3f 85%,
                #e2e8f0 100%
              );
              animation: rotate-gradient 6s linear infinite;
              z-index: 0;
            }
            .shining-border-content {
              position: relative;
              z-index: 1;
              background: white;
              border-radius: calc(1rem - 1px);
            }
          `,
        }}
      />

      {/* HEADER */}
      <div className="flex items-center justify-between px-2">
        {/* REPLACED WORLD-CLASS BRANDS TEXT WITH THE FIRE BANNER IMAGE */}
         <div className="relative h-12 w-60 md:h-16 md:w-80">
          <Image
            src="/Images/brand.png"
            alt="Top Categories Banner"
            fill
            className="object-contain object-left scale-125 md:scale-150 origin-left"
            priority
          />
        </div>
        {/* DESKTOP VIEW */}
        <Link
          href="/brands"
          className="
            hidden
            text-xs
            font-bold
            text-teal-600
            hover:underline

            md:block
          "
        >
          VIEW ALL
        </Link>

        {/* MOBILE VIEW */}
        <Link
          href="/brands"
          className="
            flex
            items-center
            justify-center

            md:hidden
          "
        >
          <ChevronRight
            size={22}
            className="text-[#64748B]"
          />
        </Link>
      </div>

      {/* DESKTOP/TABLET VIEW (CONTINUOUS SCROLLING WITH PREMIUM SHINING TRAIL) */}
      <div className="hidden md:block rounded-2xl shining-border-wrapper shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div
          className="
            shining-border-content
            p-8
            overflow-hidden
          "
        >
          <div className="relative z-10 flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
            <div
              className="
                flex
                items-center
                gap-8
                flex-shrink-0
                animate-marquee
              "
            >
              {/* Double the array map to ensure the loop is visually seamless and doesn't leave gaps */}
              {[...(brands || []), ...(brands || [])].map((brand, index) => (
                <Link
                  key={`${brand.id}-${index}`}
                  href={`/products?brandId=${brand.id}`}
                  className="flex-shrink-0"
                >
                  <div
                    className="
                      relative
                      flex
                      h-28
                      w-28
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      p-3
                      transition-colors
                      hover:border-teal-500
                    "
                  >
                    <Image
                      src={brand.imageUrl}
                      alt={brand.name}
                      width={100}
                      height={100}
                      className="object-contain"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div
        className="
          grid
          grid-cols-4
          gap-3

          md:hidden
        "
      >
        {brands?.slice(0, 8).map((brand) => (
          <Link
            key={brand.id}
            href={`/products?brandId=${brand.id}`}
            className="w-full"
          >
            <div
              className="
                flex
                flex-col
                items-center
                justify-center
              "
            >
              {/* LOGO BOX */}
              <div
                className="
                  relative
                  flex
                  h-[88px]
                  w-full
                  items-center
                  justify-center
                  rounded-[14px]
                  border
                  border-gray-200
                  bg-white
                  p-3
                "
              >
                <Image
                  src={brand.imageUrl}
                  alt={brand.name}
                  width={75}
                  height={75}
                  className="
                    object-contain
                  "
                />
              </div>

              {/* BRAND NAME */}
              <p
                className="
                  mt-1.5
                  line-clamp-1
                  text-center
                  text-[11px]
                  font-medium
                  text-[#475569]
                "
              >
                {brand.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}