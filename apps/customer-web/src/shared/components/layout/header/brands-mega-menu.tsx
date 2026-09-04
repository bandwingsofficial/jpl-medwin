"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useBrands } from "@/features/brands/hooks/use-brands";
import { Spinner } from "@/shared/components/ui/spinner";
import { useCheckoutNavigation } from "@/shared/components/checkout-navigation-guard";

interface BrandsMegaMenuProps {
  onClose: () => void;
}

const PRIORITY_BRANDS = [
  "jpl",
  "gdc",
  "3m",
  "gc",
  "ivoclar",
  "dentsply",
  "mani",
  "denmax",
  "healix",
  "neoendo",
  "prevest denpro",
];

export function BrandsMegaMenu({
  onClose,
}: BrandsMegaMenuProps) {
const { data, isLoading } = useBrands();
const router = useRouter();
const { navigate } = useCheckoutNavigation();

  const normalizeBrand = (
    value?: string,
  ) =>
    (value ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

  const getBrandPriority = (
    brand: {
      name?: string;
      slug?: string;
    },
  ) => {
    const normalizedName =
      normalizeBrand(brand.name);

    const normalizedSlug =
      normalizeBrand(brand.slug);

    const priorityIndex =
      PRIORITY_BRANDS.findIndex(
        (priorityBrand) => {
          const normalizedPriority =
            normalizeBrand(priorityBrand);

          return (
            normalizedName ===
              normalizedPriority ||
            normalizedSlug ===
              normalizedPriority ||
            normalizedName.includes(
              normalizedPriority,
            ) ||
            normalizedSlug.includes(
              normalizedPriority,
            )
          );
        },
      );

    return priorityIndex === -1
      ? PRIORITY_BRANDS.length
      : priorityIndex;
  };

  const sortedBrands = [...(data ?? [])].sort(
    (a, b) => {
      return (
        getBrandPriority(a) -
        getBrandPriority(b)
      );
    },
  );

  return (
    <div className="absolute top-full left-1/2 z-50 w-[800px] -translate-x-1/2 select-none pt-2">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
        {/* HEADER */}
        <div className="mb-5 flex items-center justify-between border-b border-gray-50 pb-3">
          <div className="flex items-center gap-2">
            <h3
              className="
                animate-text-shine
                bg-gradient-to-r
                from-[#001f3f]
                via-[#0d9488]
                to-[#001f3f]
                bg-clip-text
                text-[16px]
                font-bold
                text-transparent
              "
            >
              Shop by Brand
            </h3>

            {!isLoading && data && (
              <span className="rounded-md bg-[#E6F7F5] px-2 py-0.5 text-[11px] font-bold text-[#0F9EA5]">
                {data.length}
              </span>
            )}
          </div>

          <button
            onClick={() => {
  onClose();
  navigate("/brands");
}}
            className="text-xs font-semibold text-teal-600 transition-colors hover:underline"
          >
            View All Brands
          </button>
        </div>

        {/* CONTENT GRID */}
        <div>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
              {sortedBrands
                .slice(0, 12)
                .map((brand) => (
                  <div
                    key={brand.id}
                    onClick={() => {
                      onClose();
                      navigate(
                        `/brands/${brand.slug}`,
                      );
                    }}
                    className="
                      group
                      flex
                      h-[90px]
                      cursor-pointer
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-xl
                      border
                      border-gray-100
                      bg-white
                      transition-all
                      hover:border-teal-100
                      hover:shadow-sm
                    "
                  >
                    {typeof brand.imageUrl === "string" &&
                    brand.imageUrl.trim() !== "" ? (
                      <div className="relative h-full w-full transition-transform duration-300 group-hover:scale-105">
                        <Image
                          src={brand.imageUrl}
                          alt={brand.name}
                          fill
                          sizes="120px"
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center px-2 text-center text-xs text-slate-400">
                        <span className="line-clamp-2">
                          {brand.name}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}