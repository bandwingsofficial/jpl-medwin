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

        {/* RIGHT */}

        <div className="flex flex-wrap items-center gap-3 lg:justify-start">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;

            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`group flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-all duration-300

                  ${
                    active
                      ? "bg-gradient-to-r from-[#0BACAE] via-[#089981] to-[#0F8A6B] text-white shadow-[0_10px_30px_rgba(13,148,136,.28)]"
                      : "border border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-[#0D9488]/40 hover:text-[#0D9488] hover:shadow-md"
                  }
                `}
              >
                <Icon size={16} />
                {label}
              </button>
            );
          })}
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

      lg:grid-cols-5

      xl:grid-cols-5

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