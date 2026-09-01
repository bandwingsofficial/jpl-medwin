"use client";

import { SearchResult } from "../types/global-search.types";
import { SearchResultItem } from "./search-result-item";

interface Props {
  loading: boolean;
  results: SearchResult[];
  search: string;
  onSelect: (item: SearchResult) => void;
}

const PRIORITY_BRANDS = ["jpl", "medwin", "markwin"];

export function SearchDropdown({
  loading,
  results,
  search,
  onSelect,
}: Props) {
  const normalizedSearch = search
    .trim()
    .toLowerCase();

  const getBrandPriority = (
    item: SearchResult,
  ): number => {
    const searchableData =
      JSON.stringify(item).toLowerCase();

    const brandIndex =
      PRIORITY_BRANDS.findIndex((brand) =>
        searchableData.includes(brand),
      );

    return brandIndex === -1
      ? PRIORITY_BRANDS.length
      : brandIndex;
  };

  const getSearchPriority = (
    item: SearchResult,
  ): number => {
    const normalizedName =
      item.name.toLowerCase();

    // Exact product match
    if (normalizedName === normalizedSearch) {
      return 0;
    }

    // Product name starts with search
    if (
      normalizedName.startsWith(
        normalizedSearch,
      )
    ) {
      return 1;
    }

    // Product contains the complete search phrase
    if (
      normalizedName.includes(
        normalizedSearch,
      )
    ) {
      return 2;
    }

    // Check individual search words
    const searchWords =
      normalizedSearch
        .split(/\s+/)
        .filter(Boolean);

    const matchedWords =
      searchWords.filter((word) =>
        normalizedName.includes(word),
      ).length;

    // More matching words = higher priority
    return 10 - matchedWords;
  };

  const sortedResults = [...results].sort(
    (a, b) => {
      const searchPriorityA =
        getSearchPriority(a);

      const searchPriorityB =
        getSearchPriority(b);

      // FIRST: Search relevance
      if (
        searchPriorityA !==
        searchPriorityB
      ) {
        return (
          searchPriorityA -
          searchPriorityB
        );
      }

      // SECOND: Existing brand priority
      return (
        getBrandPriority(a) -
        getBrandPriority(b)
      );
    },
  );

  return (
    <div
      className="
        rounded-2xl
        bg-white
        shadow-xl
        max-h-[70vh]
        overflow-y-auto
        overflow-x-hidden
      "
    >
      {loading && (
        <div className="p-6 text-center text-sm text-slate-500">
          Searching...
        </div>
      )}

      {!loading && results.length === 0 && (
        <div className="p-6 text-center text-sm text-slate-500">
          No Products found
        </div>
      )}

      {!loading &&
        sortedResults.map((item) => (
          <SearchResultItem
            key={`${item.type}-${item.id}`}
            item={item}
            onSelect={onSelect}
          />
        ))}
    </div>
  );
}