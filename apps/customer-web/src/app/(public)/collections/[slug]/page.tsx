"use client";

import { useParams } from "next/navigation";
import { useCollection } from "@/features/collections/hooks/use-collection";
import { CollectionBanner } from "@/features/collections/components/collection-banner";
import { CollectionHeader } from "@/features/collections/components/collection-header";
import { CollectionProductsGrid } from "@/features/collections/components/collection-products-grid";

export default function CollectionDetailsPage() {
  const params = useParams();
  const collectionId = params.slug as string;

  const { data, isLoading } = useCollection(collectionId);

  if (isLoading) {
    return <div className="p-10">Loading...</div>;
  }

  if (!data?.collection) {
    return <div className="p-10">Collection not found</div>;
  }

  const collection = data.collection;
  const products = data.products ?? [];

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-10 space-y-10">
      <CollectionHeader
        collection={collection}
        totalProducts={products.length}
      />

      <CollectionProductsGrid products={products} />
    </div>
  );
}