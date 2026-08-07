"use client";

import { useState } from "react";

import { HomeHero } from "../components/home-hero";
import { HomeStatsBar } from "../components/home-stats-bar";
import { HomeBrands } from "../components/home-brands";
import { HomeCategories } from "../components/home-categories";
import { HomeProducts } from "../components/home-products";
import { HomeCta } from "../components/home-cta";
import { HomeCategoriespromo } from "../components/home-categories-promo";

import { HomeCollections } from "@/features/collections/components/home-collections";

import { LoginModal } from "@/features/auth/components/login-modal";

export default function HomePage() {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <main className="w-full overflow-x-hidden">
        {/* Hero + Stats */}
        <HomeHero />
        <HomeStatsBar />

        {/* Brands */}
        <section className="w-full pt-2">
          <HomeBrands />
        </section>

        {/* Categories Promo */}
        <section className="w-full pt-2">
          <HomeCategoriespromo />
        </section>

        {/* Categories */}
        <section className="w-full pt-2">
          <HomeCategories />
        </section>

        {/* Collections */}
        <section className="w-full pt-6">
          <HomeCollections />
        </section>

        {/* Products */}
        <section className="w-full pt-2">
          <HomeProducts />
        </section>

        {/* CTA */}
        <section className="w-full pt-6 pb-10">
          <HomeCta />
        </section>
      </main>

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
      />
    </>
  );
}