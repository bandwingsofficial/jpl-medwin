"use client";

import { useState } from "react";
import {
  Sparkles,
  Flame,
  Gem,
  TrendingUp,
  Crown,
  BadgePercent,
} from "lucide-react";

import { ProductCard } from "@/features/products/components/product-card";
import { ProductGridSkeleton } from "@/features/products/components/product-grid-skeleton";
import { useProducts } from "@/features/products/hooks/use-products";

const TABS = [
  {
    id: "all",
    label: "All Products",
    icon: Sparkles,
  },
  {
    id: "best",
    label: "Best Sellers",
    icon: Flame,
  },
  {
    id: "featured",
    label: "Featured",
    icon: Gem,
  },
  {
    id: "trending",
    label: "Trending",
    icon: TrendingUp,
  },
  {
    id: "offers",
    label: "Offers",
    icon: BadgePercent,
  },
];

export const HomeProducts = () => {
  const [activeTab, setActiveTab] = useState("all");

  const { data, isLoading } = useProducts({
    limit: 30,
  });

  const rawProducts =
    data?.pages?.flatMap((page: any) => page?.data?.data || []) || [];

  const products = Array.from(
    new Map(
      rawProducts.map((product: any) => [product.id, product])
    ).values()
  );

  return (
    <section className="w-full px-4 py-5 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      {/* ================= HEADER ================= */}

      <div className="mb-6 grid gap-6 lg:grid-cols-[40%_60%] lg:items-center">
        {/* LEFT */}
        <div className="border-l-[3px] border-[#0D9488] pl-4">
  <h2 className="text-[24px] font-bold leading-[1.25] tracking-normal md:text-[30px] xl:text-[34px]">
    <span className="text-slate-900">Our </span>

    <span className="bg-gradient-to-r from-[#0BACAE] via-[#089981] to-[#0F8A6B] bg-clip-text text-transparent">
      Top Products
    </span>
  </h2>
</div>
<div className="flex items-center lg:justify-end lg:pr-10">
  <a
    href="/products"
    className="group inline-flex items-center gap-2 text-base font-semibold text-[#0D7F73]"
  >
    Explore More
    <span className="text-2xl font-normal leading-none transition-transform duration-200 group-hover:translate-x-1">
      ›
    </span>
  </a>
</div>
      </div>

      {/* ================= PRODUCTS ================= */}

      {isLoading ? (
  <ProductGridSkeleton />
) : (
  <div
    className="
      grid
      grid-cols-2
      gap-4

      sm:grid-cols-2

      md:grid-cols-3

      lg:grid-cols-6

      xl:grid-cols-6

      2xl:grid-cols-5
    "
  >
    {products.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
      />
    ))}
  </div>
)}
    </section>
  );
};