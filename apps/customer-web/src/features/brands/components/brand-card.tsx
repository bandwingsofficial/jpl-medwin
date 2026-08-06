"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Card } from "@/shared/components/ui/card";
import { Brand } from "../types/brand.type";

interface Props {
  brand: Brand;
}

export function BrandCard({ brand }: Props) {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/products?brandId=${brand.id}`)}
      className="
        group
        cursor-pointer
        rounded-xl
        border
        border-slate-200
        bg-white
        overflow-hidden
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#00828a]
        hover:shadow-lg
        active:scale-[0.98]
      "
    >
      <div className="flex h-[110px] items-center justify-center p-4">
        {brand.imageUrl?.trim() ? (
          <Image
            src={brand.imageUrl}
            alt={brand.name}
            width={120}
            height={55}
            className="
              max-h-[50px]
              w-auto
              object-contain
              transition-all
              duration-300
              group-hover:scale-105
            "
          />
        ) : (
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-slate-100
              text-lg
              font-semibold
              text-slate-500
              transition-all
              duration-300
              group-hover:bg-[#00828a]/10
              group-hover:text-[#00828a]
            "
          >
            {brand.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </Card>
  );
}