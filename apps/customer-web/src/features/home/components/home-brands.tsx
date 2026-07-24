'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Globe2, ShieldCheck, Truck } from 'lucide-react';
import { useBrands } from '@/features/brands/hooks/use-brands';

export function HomeBrands() {
  const { data: brands, isLoading, isError } = useBrands();

  if (isLoading) return <div className="h-32 animate-pulse rounded-3xl bg-slate-100" />;
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
    `,
        }}
      />

      <div className="hidden overflow-hidden bg-white md:block">
        <div className="px-10 py-3">
          {/* Top Bar */}
          <div className="mb-5 flex items-center justify-between">
            <span className="rounded-full bg-teal-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em] text-teal-600">
              Trusted Worldwide
            </span>

            <Link
              href="/brands"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-teal-600"
            >
              Explore More
              <ChevronRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
          </div>

          {/* 40 : 60 */}
          <div className="grid grid-cols-[40%_60%] gap-10">
            {/* LEFT */}
            <div className="flex flex-col justify-center">
              <h2 className="text-[40px] font-extrabold leading-tight tracking-tight text-slate-900">
                Global Brand <span className="text-teal-600">Partners</span>
              </h2>

              <p className="mt-5 max-w-[500px] text-[16px] leading-8 text-slate-600">
                Partnering with <strong>100+ leading global healthcare</strong> & medical equipment
                brands trusted by hospitals, clinics and healthcare professionals across India.
              </p>

              
            </div>

            {/* RIGHT */}
            <div className="flex flex-col justify-center space-y-2">
              {/* Row 1 */}
<div className="relative overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">                
  <div className="flex animate-marquee-left gap-6 py-1">
                  {[...(brands ?? []), ...(brands ?? [])].map((brand, index) => (
                    <Link
                      key={`${brand.id}-1-${index}`}
                      href={`/products?brandId=${brand.id}`}
                      className="shrink-0"
                    >
                      <div className="flex h-[105px] w-[105px] items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-500 hover:shadow-xl">
                        <Image
                          src={brand.imageUrl}
                          alt={brand.name}
                          width={70}
                          height={70}
                          className="object-contain"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Row 2 */}
              <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
                <div className="flex animate-marquee-right gap-6 py-1">
                  {[...(brands ?? []).slice().reverse(), ...(brands ?? []).slice().reverse()].map(
                    (brand, index) => (
                      <Link
                        key={`${brand.id}-2-${index}`}
                        href={`/products?brandId=${brand.id}`}
                        className="shrink-0"
                      >
                        <div className="flex h-[105px] w-[105px] items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-500 hover:shadow-xl">
                          <Image
                            src={brand.imageUrl}
                            alt={brand.name}
                            width={70}
                            height={70}
                            className="object-contain"
                          />
                        </div>
                      </Link>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 md:hidden">
        <div>
          <span className="rounded-full bg-teal-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600">
            Trusted Worldwide
          </span>

          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900">
            Global Brand <span className="text-teal-600">Partners</span>
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            Partnering with <strong>100+ leading healthcare</strong> & medical equipment brands
            trusted by hospitals, clinics and healthcare professionals across India.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {brands?.slice(0, 6).map((brand) => (
            <Link key={brand.id} href={`/products?brandId=${brand.id}`}>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-500 hover:shadow-lg">
                <div className="flex h-16 items-center justify-center">
                  <Image
                    src={brand.imageUrl}
                    alt={brand.name}
                    width={70}
                    height={70}
                    className="object-contain"
                  />
                </div>

                <p className="mt-3 line-clamp-1 text-center text-xs font-semibold text-slate-700">
                  {brand.name}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/brands"
          className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white"
        >
          Explore All Brands
          <ChevronRight size={16} />
        </Link>
      </div>
    </section>
  );
}
