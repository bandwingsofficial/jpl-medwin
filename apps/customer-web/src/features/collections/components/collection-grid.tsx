"use client";

import { Collection } from "../types/collection.types";
import { CollectionCard } from "./collection-card";

interface CollectionGridProps {
  collections: Collection[];
}

export function CollectionGrid({
  collections,
}: CollectionGridProps) {
  const safeCollections =
    Array.isArray(collections)
      ? collections
      : [];

  return (
    <div
      className="
        grid
        gap-6
        grid-cols-2
        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-5
        xl:grid-cols-6
      "
    >
      {safeCollections.map(
        (collection) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
          />
        )
      )}
    </div>
  );
}