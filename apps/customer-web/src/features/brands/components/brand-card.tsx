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
        rounded-xl
        hover:shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
      "
    >
      {/* Top-Left Rounded L-Shape Hover Effect */}
      <span className="absolute top-0 left-0 border-t-[3px] border-l-[3px] border-[#00828a] w-0 h-0 rounded-tl-xl transition-all duration-300 group-hover:w-7 group-hover:h-7 z-10 pointer-events-none" />

      {/* Bottom-Right Rounded L-Shape Hover Effect */}
      <span className="absolute bottom-0 right-0 border-b-[3px] border-r-[3px] border-[#00828a] w-0 h-0 rounded-br-xl transition-all duration-300 group-hover:w-7 group-hover:h-7 z-10 pointer-events-none" />

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