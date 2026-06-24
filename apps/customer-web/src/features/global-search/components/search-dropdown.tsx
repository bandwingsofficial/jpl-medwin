"use client";

import { SearchResult } from "../types/global-search.types";
import { SearchResultItem } from "./search-result-item";

interface Props {
  loading: boolean;
  results: SearchResult[];
  onSelect: (item: SearchResult) => void;
}

export function SearchDropdown({
  loading,
  results,
  onSelect,
}: Props) {
  return (
    <div
      className="
      absolute
      top-full
      mt-2
      left-0
      right-0
      bg-white
      rounded-xl
      border
      border-slate-200
      shadow-xl
      z-50
      overflow-hidden
    "
    >
      {loading && (
        <div className="p-4 text-sm text-slate-500">
          Searching...
        </div>
      )}

      {!loading && results.length === 0 && (
        <div className="p-4 text-sm text-slate-500">
          No results found
        </div>
      )}

      {!loading &&
        results.map((item) => (
          <SearchResultItem
            key={`${item.type}-${item.id}`}
            item={item}
            onSelect={onSelect}
          />
        ))}
    </div>
  );
}