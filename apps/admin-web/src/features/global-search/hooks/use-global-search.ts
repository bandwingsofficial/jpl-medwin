"use client";

import { useEffect, useState } from "react";
import { searchEverything } from "../api/global-search.api";
import { SearchResult } from "../types/global-search.types";

export function useGlobalSearch(search: string) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const response = await searchEverything(search);

        setResults(response.data.results || []);
      } catch (error) {
        console.error(error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  return {
    results,
    loading,
  };
}