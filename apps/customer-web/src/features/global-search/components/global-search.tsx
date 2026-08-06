"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils"; // Update if your cn path is different

import { useGlobalSearch } from "../hooks/use-global-search";
import { SearchResult } from "../types/global-search.types";
import { AnimatedPlaceholder } from "./AnimatedPlaceholder";
import { SearchDropdown } from "./search-dropdown";

export function GlobalSearch() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const { results, loading } = useGlobalSearch(query);

  const handleSelect = (item: SearchResult) => {
    setFocused(false);
    setQuery("");

    switch (item.type) {
      case "PRODUCT":
        router.push(`/products/${item.slug}`);
        break;

      case "CATEGORY":
        router.push(`/categories/${item.id}`);
        break;

      case "BRAND":
        router.push(`/products?brand=${item.id}`);
        break;

      case "SUB_CATEGORY":
        router.push(`/products?subCategory=${item.id}`);
        break;

      case "MINI_CATEGORY":
        router.push(`/products?miniCategory=${item.id}`);
        break;

      default:
        break;
    }
  };

  return (
    <div className={cn("relative w-full")}>
      <input
        value={query}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setTimeout(() => {
            setFocused(false);
          }, 200);
        }}
        onChange={(e) => setQuery(e.target.value)}
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
        <SearchDropdown
          loading={loading}
          results={results}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}