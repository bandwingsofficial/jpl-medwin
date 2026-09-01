"use client";

import { useCheckoutNavigation } from "@/shared/components/checkout-navigation-guard";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { useGlobalSearch } from "../hooks/use-global-search";
import { SearchResult } from "../types/global-search.types";
import { AnimatedPlaceholder } from "./AnimatedPlaceholder";
import { SearchDropdown } from "./search-dropdown";

export function GlobalSearch() {
  const { navigate } = useCheckoutNavigation();

  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const { results, loading } = useGlobalSearch(query);

  const handleSelect = (item: SearchResult) => {
    setFocused(false);
    setQuery("");

    switch (item.type) {
      case "PRODUCT":
        navigate(`/products/${item.slug}`);
        break;

      case "CATEGORY":
        navigate(`/categories/${item.id}`);
        break;

      case "BRAND":
        navigate(`/products?brand=${item.id}`);
        break;

      case "SUB_CATEGORY":
        navigate(`/products?subCategory=${item.id}`);
        break;

      case "MINI_CATEGORY":
        navigate(`/products?miniCategory=${item.id}`);
        break;

      default:
        break;
    }
  };

  const handleSearch = () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    setFocused(false);
    setQuery("");

    navigate(
      `/search?q=${encodeURIComponent(trimmedQuery)}`
    );
  };

  return (
    <div className="relative w-full">
      <input
        value={query}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setTimeout(() => {
            setFocused(false);
          }, 200);
        }}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            handleSearch();
          }
        }}
        placeholder=""
        className={cn(
          "h-12 w-full rounded-2xl border border-slate-400 bg-white",
          "pl-10 pr-4",
          "text-sm text-slate-900 placeholder-transparent",
          "outline-none transition-all duration-200",
          "focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
        )}
      />

      <AnimatedPlaceholder query={query} />

      {focused && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-[9999] mt-2">
          <SearchDropdown
  loading={loading}
  results={results}
  search={query}
  onSelect={handleSelect}
/>
        </div>
      )}
    </div>
  );
}