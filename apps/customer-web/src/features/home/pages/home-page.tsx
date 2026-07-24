"use client";

import { HomeHero } from "../components/home-hero";
import { HomeStatsBar } from "../components/home-stats-bar";
import { HomeBrands } from "../components/home-brands";
import { HomeCategories } from "../components/home-categories";
import { HomeProducts } from "../components/home-products";
import { HomeCta } from "../components/home-cta";
import { HomeCategoriespromo } from "../components/home-categories-promo";

import {
  HomeCollections,
} from "@/features/collections/components/home-collections";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-2 pt-1 pb-6">
      {/* Hero + Stats */}
      <section className="space-y-8">
        <HomeHero />
        <HomeStatsBar />
      </section>

      {/* Brands */}
      <section className="pt-2">
        <HomeBrands />
      </section>

      {/* Categories Promo */}
      <section className="pt-2">
        <HomeCategoriespromo />
      </section>
      
      {/* Categories */}
      <section className="pt-2">
        <HomeCategories />
      </section>

      {/* Collection-wise Products */}
      <section className="pt-6">
        <HomeCollections />
      </section>

      {/* Products */}
      <section className="pt-2">
        <HomeProducts />
      </section>

      {/* CTA */}
      <section className="pt-6 pb-10">
        <HomeCta />
      </section>
    </main>
  );
}