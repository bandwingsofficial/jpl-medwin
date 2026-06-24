"use client";

import { ProductGridSkeleton } from "@/features/products/components/product-grid-skeleton";
import { useProducts } from "@/features/products/hooks/use-products";
import { Product } from "@/features/products/types/product.type";
import { ProductCard } from "./product-card";

interface RelatedProductsProps {
  currentProductId: string;
  categoryId?: string;
}

export function RelatedProducts({
  currentProductId,
  categoryId,
}: RelatedProductsProps) {
  // Query 1: Fetch matching category entries from Infinite Query setup
  const {
    data: categoryInfiniteData,
    isLoading: isCategoryLoading,
  } = useProducts({
    categoryId,
    limit: 20,
  });

  // Query 2: Fetch fallback catalog up to 100 entries from Infinite Query setup
  const {
    data: fallbackInfiniteData,
    isLoading: isFallbackLoading,
  } = useProducts({
    limit: 100,
  });

  if (isCategoryLoading || isFallbackLoading) {
    return <ProductGridSkeleton />;
  }

  // Safe extraction helper to extract products array out of InfiniteData structure pages
  const extractProducts = (infiniteData: any): Product[] => {
    if (!infiniteData?.pages) return [];
    return infiniteData.pages.flatMap((page: any) => page?.data?.data ?? page?.data ?? []);
  };

  const categoryProductsList = extractProducts(categoryInfiniteData);
  const totalCatalogList = extractProducts(fallbackInfiniteData);

  // 1. Process matching relative items from target category first
  const relatedFiltered = categoryProductsList.filter(
    (product) => product && product.id !== currentProductId
  );

  // 2. Process wide shop catalog items as continuous backup feed
  const backupFiltered = totalCatalogList.filter(
    (product) => 
      product &&
      product.id !== currentProductId && 
      !relatedFiltered.some((r) => r.id === product.id)
  );

  // Combine arrays: Category items first, then general inventory items up to a 100 item limit
  const allAvailableProducts = [...relatedFiltered, ...backupFiltered].slice(0, 100);

  if (!allAvailableProducts.length) {
    return null;
  }

  // --------------------------------------------------------------------------
  // CHUNK PRODUCTS INTO 4 LOGICAL SECTIONS
  // --------------------------------------------------------------------------
  
  // Row 1: Discover More Products (Items matching the exact same category context)
  const discoverMoreProducts = relatedFiltered.slice(0, 6);

  // Remaining general backup pool items left over to separate into sections
  const remainingPool = backupFiltered;

  // Row 2: Trending Selections
  const trendingProducts = remainingPool.slice(0, 6);

  // Row 3: Customer Favorites
  const favoriteProducts = remainingPool.slice(6, 12);

  // Row 4: Explore Our Catalog (Shows up to 100 complete inventory items)
  const allCatalogProducts = allAvailableProducts;

  // Shared responsive grid layout style matching your references up to 6 columns
  const gridClassName = "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6";

  return (
    <div className="space-y-14 mt-14">
      
      {/* ROW 1: DISCOVER MORE PRODUCTS */}
      {discoverMoreProducts.length > 0 && (
        <section className="w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Discover More Products
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Explore similar choices curated directly from this category
            </p>
          </div>
          <div className={gridClassName}>
            {discoverMoreProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ROW 2: TRENDING SELECTIONS */}
      {trendingProducts.length > 0 && (
        <section className="w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Trending Selections
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Check out popular items highly requested by alternative buyers today
            </p>
          </div>
          <div className={gridClassName}>
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ROW 3: CUSTOMER FAVORITES */}
      {favoriteProducts.length > 0 && (
        <section className="w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Customer Favorites
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              The highest reviewed healthcare utilities and medical additions
            </p>
          </div>
          <div className={gridClassName}>
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ROW 4: EXPLORE OUR CATALOG (FULL 100 LIST) */}
      {allCatalogProducts.length > 0 && (
        <section className="w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Explore Our Catalog
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Browse completely through all products across our entire inventory pool
            </p>
          </div>
          <div className={gridClassName}>
            {allCatalogProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}