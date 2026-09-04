"use client";

import {
  useCollections,
} from "../hooks/use-collections";

import {
  CollectionSection,
} from "./collection-section";

import {
  PromotionalBanner,
} from "@/features/banners/components/promotional-baner";

export function HomeCollections() {
  const {
    data: collections = [],
    isLoading,
    error,
  } = useCollections();
  if (isLoading) {
    return (
      <div className="py-10 text-center">
        Loading Collections...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center text-red-500">
        Collections Coming Soon
      </div>
    );
  }

  if (!collections?.length) {
    return (
      <div className="py-10 text-center">
    Collection Coming Soon.....
      </div>
    );
  }

  return (
    <div
      className="
        space-y-6
      "
    >
      {collections.map(
        (
          collection,
          index
        ) => (
          <div
            key={
              collection.id
            }
            className="
              space-y-4
            "
          >
           <CollectionSection
  collectionSlug={
    collection.slug
  }
  collectionName={
    collection.name
  }
  collectionImage={
    collection.imageUrl
  }
/>

            {/* PROMOTIONAL BANNER AFTER EVERY 2 COLLECTIONS */}

            {(index + 1) %
              2 ===
              0 &&
              index !==
                collections.length -
                  1 && (
                <PromotionalBanner
                  bannerIndex={
                    Math.floor(
                      index / 2
                    )
                  }
                />
              )}
          </div>
        )
      )}
    </div>
  );
}