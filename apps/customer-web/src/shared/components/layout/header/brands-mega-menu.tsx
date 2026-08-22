"use client";

import { useBrands } from "@/features/brands/hooks/use-brands";
import { Spinner } from "@/shared/components/ui/spinner";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BrandsMegaMenuProps {
  onClose: () => void;
}

export function BrandsMegaMenu({
  onClose,
}: BrandsMegaMenuProps) {
  const { data, isLoading } = useBrands();
  const router = useRouter();

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[800px] z-50 select-none">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 overflow-hidden">
        
        {/* ✨ UPDATED HEADER SECTION */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-50">
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
              <span className="bg-[#E6F7F5] text-[#0F9EA5] text-[11px] px-2 py-0.5 rounded-md font-bold">
                {data.length}
              </span>
            )}
          </div>

          <button
            onClick={() => {
              onClose();
              router.push("/brands");
            }}
            className="text-xs font-semibold text-teal-600 hover:underline transition-colors"
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {data?.slice(0, 12).map((brand) => (
                <div
                  key={brand.id}
                  onClick={() => {
                    onClose();
                   router.push(`/brands/${brand.slug}`);
                  }}
                  className="group cursor-pointer flex items-center justify-center border border-gray-100 rounded-xl h-[90px] p-3 hover:border-teal-100 hover:shadow-sm transition-all bg-white"
                >
                  <div className="relative w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    {typeof brand.imageUrl === "string" && brand.imageUrl.trim() !== "" ? (
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
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}