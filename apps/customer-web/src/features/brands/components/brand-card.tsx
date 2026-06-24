"use client";

import { Brand } from "../types/brand.type";
import { Card } from "@/shared/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  brand: Brand;
}

export function BrandCard({ brand }: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/products?brandId=${brand.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      className="
        group
        relative
        overflow-hidden
        cursor-pointer
        p-4
        flex
        flex-col
        items-center
        justify-center
        gap-3
        h-[140px]
        hover:shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
      "
    >
      {/* Top-Left Corner Borders (Matching Brand Deep Teal) */}
      <span className="absolute top-0 left-0 right-0 border-t-2 border-[#00828a] scale-x-0 origin-top-left transition-transform duration-300 group-hover:scale-x-100 z-10 pointer-events-none rounded-t-lg" />
      <span className="absolute top-0 bottom-0 left-0 border-l-2 border-[#00828a] scale-y-0 origin-top-left transition-transform duration-300 group-hover:scale-y-100 z-10 pointer-events-none rounded-l-lg" />

      {/* Bottom-Right Corner Borders (Matching Brand Deep Teal) */}
      <span className="absolute bottom-0 left-0 right-0 border-b-2 border-[#00828a] scale-x-0 origin-bottom-right transition-transform duration-300 group-hover:scale-x-100 z-10 pointer-events-none rounded-b-lg" />
      <span className="absolute top-0 bottom-0 right-0 border-r-2 border-[#00828a] scale-y-0 origin-bottom-right transition-transform duration-300 group-hover:scale-y-100 z-10 pointer-events-none rounded-r-lg" />

      {/* LOGO */}
      <div className="relative w-full h-[70px] overflow-hidden">
        <Image
          src={brand.imageUrl}
          alt={brand.name}
          fill
          sizes="200px"
          className="object-contain transition-opacity duration-300 group-hover:opacity-90"
        />
      </div>

      {/* NAME */}
      <p className="text-sm font-medium text-center text-gray-700 line-clamp-2">
        {brand.name}
      </p>
    </Card>
  );
}