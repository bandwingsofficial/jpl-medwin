"use client";

import { Collection } from "../types/collection.types";

interface CollectionBannerProps {
  collection: Collection;
}

export function CollectionBanner({
  collection,
}: CollectionBannerProps) {
  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-3xl
        bg-white
        border
      "
    >
      <div
        className="
          h-[300px]
          w-full
        "
      >
        <img
          src={
            collection.imageUrl ||
            "/images/collection-placeholder.jpg"
          }
          alt={collection.name}
          className="
            h-full
            w-full
            object-cover
          "
        />
      </div>

      <div
        className="
          absolute
          inset-0
          bg-black/40
        "
      />

      <div
        className="
          absolute
          bottom-0
          left-0
          p-8
          text-white
        "
      >
        <h1
          className="
            text-4xl
            font-bold
          "
        >
          {collection.name}
        </h1>

        {collection.description && (
          <p
            className="
              mt-3
              max-w-2xl
              text-sm
              text-white/90
            "
          >
            {collection.description}
          </p>
        )}
      </div>
    </section>
  );
}