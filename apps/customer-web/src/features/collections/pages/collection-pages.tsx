"use client";

import {
  CollectionGrid,
} from "@/features/collections/components/collection-grid";

import {
  useCollections,
} from "@/features/collections/hooks/use-collections";

export default function CollectionsPage() {
  const {
    data,
    isLoading,
    error,
  } = useCollections();

  const collections =
    Array.isArray(data)
      ? data
      : [];


  if (isLoading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-red-500">
        Failed to load collections
      </div>
    );
  }

  return (
    <div
      className="
        container
        mx-auto
        py-10
      "
    >
      <h1
        className="
          mb-8
          text-3xl
          font-bold
        "
      >
        Collections
      </h1>

      <CollectionGrid
        collections={collections}
      />
    </div>
  );
}