"use client";

import { useCollections } from "../hooks/use-collections";
import { CollectionSection } from "./collection-section";
import { PromotionalBanner } from "@/features/banners/components/promotional-baner";

export function HomeCollections() {
  const {
    data: collections = [],
    isLoading,
    error,
  } = useCollections();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        Loading Collections...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-12">
        Failed to load collections
      </div>
    );
  }

  if (!collections.length) {
    return (
      <div className="flex justify-center py-12">
        Collection Coming Soon.....
      </div>
    );
  }

  return (
    <section className="w-full px-4 py-5 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="space-y-14">
        {collections.map((collection, index) => (
          <div key={collection.id} className="space-y-14">
            <CollectionSection
              collectionId={collection.id}
              collectionName={collection.name}
              collectionSlug={collection.slug}
              collectionImage={collection.imageUrl}
            />

            {(index + 1) % 2 === 0 &&
              index !== collections.length - 1 && (
                <PromotionalBanner
                  bannerIndex={Math.floor(index / 2)}
                />
              )}
          </div>
        ))}
      </div>
    </section>
  );
}