'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Globe2, ShieldCheck, Truck } from 'lucide-react';
import { useBrands } from '@/features/brands/hooks/use-brands';

export function HomeBrands() {
  const { data: brands, isLoading, isError } = useBrands();

  <div className="h-32 animate-pulse rounded-3xl bg-slate-100" />;
  if (isError) return null;

  return (
    <section className="space-y-2">
      <style
        dangerouslySetInnerHTML={{
          __html: `
      @keyframes marqueeLeft {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-50%);
        }
      }

      @keyframes marqueeRight {
        0% {
          transform: translateX(-50%);
        }
        100% {
          transform: translateX(0);
        }
      }

      .animate-marquee-left {
        animation: marqueeLeft 28s linear infinite;
        will-change: transform;
      }

      .animate-marquee-right {
        animation: marqueeRight 28s linear infinite;
        will-change: transform;
      }

      .animate-marquee-left:hover,
      .animate-marquee-right:hover {
        animation-play-state: paused;
      }

      /* Mobile: Increase marquee speed only */
      @media (max-width: 767px) {
        .animate-marquee-left,
        .animate-marquee-right {
          animation-duration: 12s;
        }
      }

      /* Hide scrollbar for Chrome, Safari and Opera */
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }

      /* Hide scrollbar for IE, Edge and Firefox */
      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `,
        }}
      />

      <div className="hidden overflow-hidden bg-white md:block">
        <div className="px-10 py-3">
          {/* Top Bar */}
          <div className="mb-5 flex items-center justify-between">
             <div className="border-l-[3px] border-[#0D9488] pl-4">
            <h2 className="text-[24px] font-bold leading-[1.25] tracking-normal md:text-[30px] xl:text-[34px]">
              <span className="text-slate-900">
                Global{" "}
              </span>

              <span className="bg-gradient-to-r from-[#0BACAE] via-[#089981] to-[#0F8A6B] bg-clip-text text-transparent">
                Brand Partners
              </span>
            </h2>
          </div>

            <Link
              href="/brands"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-teal-600"
            >
              Explore More
              <ChevronRight
                size={16}
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Brand Marquee Rows */}
          <div className="flex flex-col justify-center space-y-2">
            {/* Row 1 */}
            <div className="relative overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
              <div className="flex animate-marquee-left gap-6 py-1">
                {[...(brands ?? []), ...(brands ?? [])].map(
                  (brand, index) => (
                    <Link
                      key={`${brand.id}-1-${index}`}
                      href={`/products?brandId=${brand.id}`}
                      className="shrink-0"
                    >
                      <div className="flex h-[105px] w-[105px] items-center justify-center rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-500 hover:bg-white">
                        {typeof brand.imageUrl === 'string' &&
                        brand.imageUrl.trim() !== '' ? (
                          <Image
                            src={brand.imageUrl}
                            alt={brand.name}
                            width={70}
                            height={70}
                            className="object-contain"
                          />
                        ) : (
                          <div className="flex h-[70px] w-[70px] items-center justify-center text-xs text-slate-400">
                            {brand.name}
                          </div>
                        )}
                      </div>
                    </Link>
                  ),
                )}
              </div>
            </div>

            {/* Row 2 */}
            <div className="relative overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
              <div className="flex animate-marquee-right gap-6 py-1">
                {[...(brands ?? []).slice().reverse(), ...(brands ?? []).slice().reverse()].map(
                  (brand, index) => (
                    <Link
                      key={`${brand.id}-2-${index}`}
                      href={`/products?brandId=${brand.id}`}
                      className="shrink-0"
                    >
                      <div className="flex h-[105px] w-[105px] items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-500 hover:bg-white hover:shadow-[0_8px_20px_rgba(13,148,136,0.15)]">
                        {typeof brand.imageUrl === 'string' &&
                        brand.imageUrl.trim() !== '' ? (
                          <Image
                            src={brand.imageUrl}
                            alt={brand.name}
                            width={70}
                            height={70}
                            className="object-contain"
                          />
                        ) : (
                          <div className="flex h-[70px] w-[70px] items-center justify-center text-xs text-slate-400">
                            {brand.name}
                          </div>
                        )}
                      </div>
                    </Link>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 md:hidden">
  <div className="ml-4">
    <div className="border-l-[3px] border-[#0D9488] pl-4">
      <h2 className="text-[24px] font-bold leading-[1.25] tracking-normal md:text-[30px] xl:text-[34px]">
        <span className="text-slate-900">
          Shop by{" "}
        </span>

        <span className="bg-gradient-to-r from-[#0BACAE] via-[#089981] to-[#0F8A6B] bg-clip-text text-transparent">
          Brands
        </span>
      </h2>
    </div>
  </div>

        {/* Mobile Continuous Auto-Scroll Marquee */}
        <div className="relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
          <div className="flex animate-marquee-left gap-4 py-1">
            {[...(brands ?? []), ...(brands ?? [])].map((brand, index) => (
              <Link
                key={`${brand.id}-mob-${index}`}
                href={`/products?brandId=${brand.id}`}
                className="shrink-0"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-500 hover:bg-white hover:shadow-lg">
                  {typeof brand.imageUrl === 'string' &&
                  brand.imageUrl.trim() !== '' ? (
                    <Image
                      src={brand.imageUrl}
                      alt={brand.name}
                      width={70}
                      height={70}
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex h-[70px] w-[70px] items-center justify-center text-xs text-slate-400">
                      {brand.name}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <Link
  href="/brands"
  className="mx-3 flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white"
>
  Explore All Brands
  <ChevronRight size={16} />
</Link>
      </div>
    </section>
  );
}