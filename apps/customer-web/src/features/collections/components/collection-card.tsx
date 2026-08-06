"use client";

import Link from "next/link";

import { Collection } from "../types/collection.types";

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({
  collection,
}: CollectionCardProps) {
  return (
    <Link
      href={`/collections/${collection.id}`}
      className="
        group
        block
      "
    >
      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          bg-white
          transition-all
          duration-300
          hover:shadow-lg
        "
      >
        <div
          className="
            aspect-[16/9]
            overflow-hidden
            bg-gray-100
          "
        >
          <img
            src={
              collection.imageUrl ||
              "/images/collection-placeholder.png"
            }
            alt={collection.name}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-300
              group-hover:scale-105
            "
          />
        </div>

        <div className="p-4">
          <h3
            className="
              text-lg
              font-semibold
              text-gray-900
            "
          >
            {collection.name}
          </h3>

          {collection.description && (
            <p
              className="
                mt-2
                line-clamp-2
                text-sm
                text-gray-500
              "
            >
              {collection.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}