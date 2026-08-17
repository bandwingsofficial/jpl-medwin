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
      onClick={() => router.push(`/brands/${brand.slug}`)}
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
    h-full
    w-full
    items-center
    justify-center
    rounded-lg
    bg-white
    from-teal-50
    via-white
    to-cyan-50
    px-1
    text-center
    text-base
    font-semibold
    leading-tight
    text-slate-700
    transition-all
    duration-300
    group-hover:bg-white
    group-hover:text-[#00828a]
  "
>
  <span className="line-clamp-2">
    {brand.name}
  </span>
</div>
        )}
      </div>
    </Card>
  );
}