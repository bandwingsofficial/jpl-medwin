"use client";

import { KeyboardEvent } from "react";
import { Loader2, MapPin, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/shared/components/ui/input";

import type { LocationData } from "../types/location.types";
import { useLocationSearch } from "../hooks/useLocationSearch";

interface LocationSearchProps {
  onSelect: (location: LocationData) => void;
}

export function LocationSearch({
  onSelect,
}: LocationSearchProps) {
  const {
    query,
    results,
    loading,
    selectedIndex,
    setQuery,
    moveDown,
    moveUp,
    selectResult,
    clear,
    activeResult,
  } = useLocationSearch();

  function handleKeyDown(
    e: KeyboardEvent<HTMLInputElement>
  ) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        moveDown();
        break;

      case "ArrowUp":
        e.preventDefault();
        moveUp();
        break;

      case "Escape":
        clear();
        break;

      case "Enter":
        if (!activeResult) return;

        e.preventDefault();

        selectResult(activeResult);
        onSelect(activeResult);
        break;
    }
  }

  return (
    <div className="relative">
      {/* Search Icon */}

      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search city, locality or pincode..."
        className="h-12 rounded-xl border-slate-200 pl-11 pr-10"
      />

      {/* Loading */}

      {loading && (
        <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-teal-600" />
      )}

      {/* Results */}

      {results.length > 0 && (
        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {results.map((result, index) => (
            <button
              key={`${result.formatted}-${index}`}
              type="button"
              onClick={() => {
                selectResult(result);
                onSelect(result);
              }}
              className={cn(
                "flex w-full items-start gap-4 px-4 py-4 text-left transition-all duration-200",
                "hover:bg-teal-50",
                selectedIndex === index && "bg-teal-50"
              )}
            >
              {/* Icon */}

              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50">
                <MapPin className="h-5 w-5 text-teal-600" />
              </div>

              {/* Address */}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {result.city}
                  {result.state ? `, ${result.state}` : ""}
                </p>

                <p
                  className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500"
                  title={result.formatted}
                >
                  {result.formatted}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Empty State */}

      {!loading &&
        query &&
        results.length === 0 && (
          <div className="absolute left-0 right-0 z-50 mt-2 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl">
            <MapPin className="mx-auto mb-2 h-8 w-8 text-slate-300" />

            <p className="font-medium text-slate-700">
              No locations found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try searching by city, locality or pincode.
            </p>
          </div>
        )}
    </div>
  );
}