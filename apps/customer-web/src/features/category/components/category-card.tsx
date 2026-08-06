"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Card } from "@/shared/components/ui/card";
import { Category } from "../types/category.type";

interface Props {
  category: Category;
}

export default function CategoryCard({ category }: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/products?categoryId=${category.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      className="
        group
        cursor-pointer
        rounded-2xl
        border
        border-slate-200
        bg-white
        overflow-hidden
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#00828a]
        hover:shadow-xl
        hover:shadow-[#00828a]/10
        active:scale-[0.98]
      "
    >
      <div className="flex h-[185px] flex-col items-center px-4 py-5">

        {/* Image */}
        <div className="flex h-[95px] w-full items-center justify-center flex-shrink-0">
          <Image
            src={category.imageUrl || "/placeholder.png"}
            alt={category.name}
            width={90}
            height={90}
            className="
              max-h-[90px]
              max-w-[90px]
              h-auto
              w-auto
              object-contain
              transition-transform
              duration-300
              group-hover:scale-105
            "
          />
        </div>

        {/* Name */}
        <div className="mt-4 flex flex-1 items-start justify-center w-full">
          <h3
            className="
              text-center
              text-[16px]
              font-semibold
              leading-6
              text-slate-700
              break-words
              transition-colors
              duration-300
              group-hover:text-[#00828a]
            "
          >
            {category.name}
          </h3>
        </div>
      </div>
    </Card>
  );
}