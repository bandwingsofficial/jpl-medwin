"use client";

import { Collection } from "../types/collection.types";

interface Props {
  collection: Collection;
  totalProducts: number;
}

export function CollectionHeader({
  collection,
  totalProducts,
}: Props) {
  return (
    <div
      className="
        flex
        flex-col
        gap-4
        md:flex-row
        md:items-center
        md:justify-between
      "
    >
      <div>
        <h2
          className="
           animate-text-shine
            bg-gradient-to-r 
            from-[#001f3f] 
            via-[#0d9488] 
            to-[#001f3f] 
            bg-clip-text 
            text-[28px] 
            font-bold 
            text-transparent"
        >
          {collection.name}
        </h2>

        <p
          className="
            mt-2
            text-sm
            text-gray-500
          "
        >
          {totalProducts}
          {" "}
          products available
        </p>
      </div>
    </div>
  );
}