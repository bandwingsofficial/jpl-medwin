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
            text-3xl
            font-bold
          "
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