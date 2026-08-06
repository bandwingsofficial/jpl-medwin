"use client";

import Link from "next/link";

import {
  useCollections,
} from "../hooks/use-collections";

export function CollectionNavbarMenu() {
  const {
    data,
    isLoading,
  } = useCollections();

  const collections =
    Array.isArray(data)
      ? data
      : [];

  if (
    isLoading ||
    collections.length === 0
  ) {
    return (
      <div className="relative">
        <button
          className="
            text-white
            font-medium
          "
        >
          Collections
        </button>
      </div>
    );
  }

  return (
    <div className="relative group">
      <button
        className="
          text-white
          font-medium
        "
      >
        Collections
      </button>

      <div
        className="
          invisible
          absolute
          left-0
          top-full
          z-50
          mt-2
          min-w-[240px]
          overflow-hidden
          rounded-xl
          bg-white
          opacity-0
          shadow-lg
          transition-all
          duration-200
          group-hover:visible
          group-hover:opacity-100
        "
      >
        {collections.map(
          (collection: any) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.id}`}
              className="
                block
                px-4
                py-3
                text-sm
                text-gray-700
                transition-colors
                hover:bg-gray-50
              "
            >
              {collection.name}
            </Link>
          )
        )}
      </div>
    </div>
  );
}