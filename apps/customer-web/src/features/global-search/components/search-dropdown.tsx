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