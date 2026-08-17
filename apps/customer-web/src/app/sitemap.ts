import type { MetadataRoute } from "next";

const BASE_URL = "https://jplmedwin.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // =========================================================
    // HOME
    // =========================================================
    {
      url: BASE_URL,
      changeFrequency: "daily",
      priority: 1,
    },

    // =========================================================
    // MAIN PUBLIC PAGES
    // =========================================================
    {
      url: `${BASE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/brands`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/categories`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/collections`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/products`,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/Best-Seller`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/special-offers`,
      changeFrequency: "daily",
      priority: 0.9,
    },

    // =========================================================
    // BUSINESS / COMPANY PAGES
    // =========================================================
    {
      url: `${BASE_URL}/contact-us`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/bulk-contact`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/careers`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/events`,
      changeFrequency: "monthly",
      priority: 0.6,
    },

    // =========================================================
    // LEGAL / POLICY PAGES
    // =========================================================
    {
      url: `${BASE_URL}/privacy-policy`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/terms-of-use`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/disclaimer`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/shipping-policy`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/refund-policy`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/return-policy`,
      changeFrequency: "yearly",
      priority: 0.4,
    },

    // =========================================================
    // DYNAMIC PUBLIC ROUTES
    // =========================================================
    // IMPORTANT:
    // Do NOT add:
    // /products/[slug]
    // /collections/[slug]
    // /categories/[categorySlug]
    // /categories/[categorySlug]/[subCategorySlug]/products
    //
    // These must contain the REAL slugs from your backend/database.
    // They should be generated dynamically in the sitemap.
  ];
}