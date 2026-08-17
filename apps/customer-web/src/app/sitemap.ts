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
      url: `${BASE_URL}/Best-Seller`,
      changeFrequency: "weekly",
      priority: 0.8,
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

    // =========================================================
    // PRODUCTS
    // =========================================================
    {
      url: `${BASE_URL}/products`,
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}