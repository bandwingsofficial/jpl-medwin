"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useGlobalSearch } from "../hooks/use-global-search";
import { SearchDropdown } from "./search-dropdown";
import { SearchResult } from "../types/global-search.types";

export function GlobalSearch() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const { results, loading } =
    useGlobalSearch(query);

  const handleSelect = (
    item: SearchResult
  ) => {
    setFocused(false);

    switch (item.type) {
      case "PRODUCT":
  router.push(`/products?highlight=${item.id}`);
  break;
      case "BRAND":
        router.push(
          `/products?brand=${item.id}`
        );
        break;

      case "CATEGORY":
        router.push(
          `/products?category=${item.id}`
        );
        break;

      case "SUB_CATEGORY":
        router.push(
          `/products?subCategory=${item.id}`
        );
        break;

      case "MINI_CATEGORY":
        router.push(
          `/products?miniCategory=${item.id}`
        );
        break;
    }
  };

  return (
    <div className="relative w-full">
      <input
        value={query}
        onFocus={() => setFocused(true)}
        onChange={(e) =>
          setQuery(e.target.value)
        }
        placeholder="Search products, brands, categories..."
        className="
          w-full
          h-10
          pl-10
          pr-4
          rounded-xl
          border
          border-slate-200
          bg-slate-50
          text-sm
          outline-none
          focus:border-teal-500
          focus:ring-4
          focus:ring-teal-500/10
        "
      />

      <Search
        className="
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          h-4
          w-4
          text-slate-400
        "
      />

      {focused &&
        query.trim().length > 0 && (
          <SearchDropdown
            loading={loading}
            results={results}
            onSelect={handleSelect}
          />
        )}
    </div>
  );
}