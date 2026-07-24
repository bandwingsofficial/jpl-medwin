"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { LocationData } from "../types/location.types";

import { searchLocations } from "../lib/location-api";

const DEBOUNCE_DELAY = 350;

interface UseLocationSearchReturn {
  query: string;
  results: LocationData[];
  loading: boolean;
  error: string | null;
  selectedIndex: number;

  setQuery: (value: string) => void;
  clear: () => void;

  moveUp: () => void;
  moveDown: () => void;

  selectResult: (
    result: LocationData
  ) => void;

  activeResult: LocationData | null;
}

export function useLocationSearch(): UseLocationSearchReturn {
  const [query, setQuery] = useState("");

  const [results, setResults] = useState<LocationData[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [selectedIndex, setSelectedIndex] = useState(-1);

  /**
   * ---------------------------------------
   * SEARCH
   * ---------------------------------------
   */

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await searchLocations(
          query,
          controller.signal
        );

        setResults(data);
      } catch (err) {
        if (
          err instanceof DOMException &&
          err.name === "AbortError"
        ) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Unable to search locations."
        );

        setResults([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_DELAY);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  /**
   * ---------------------------------------
   * KEYBOARD NAVIGATION
   * ---------------------------------------
   */

  const moveDown = useCallback(() => {
    setSelectedIndex((prev) => {
      if (!results.length) return -1;

      return Math.min(
        prev + 1,
        results.length - 1
      );
    });
  }, [results]);

  const moveUp = useCallback(() => {
    setSelectedIndex((prev) => {
      if (!results.length) return -1;

      return Math.max(prev - 1, 0);
    });
  }, [results]);

  /**
   * ---------------------------------------
   * CLEAR
   * ---------------------------------------
   */

  const clear = useCallback(() => {
    setQuery("");
    setResults([]);
    setError(null);
    setSelectedIndex(-1);
  }, []);

  /**
   * ---------------------------------------
   * SELECT
   * ---------------------------------------
   */

  const selectResult = useCallback(
    (result: LocationData) => {
      setQuery(result.formatted);
      setResults([]);
      setSelectedIndex(-1);
    },
    []
  );

  /**
   * ---------------------------------------
   * ACTIVE RESULT
   * ---------------------------------------
   */

  const activeResult = useMemo(() => {
    if (
      selectedIndex < 0 ||
      selectedIndex >= results.length
    ) {
      return null;
    }

    return results[selectedIndex];
  }, [results, selectedIndex]);

  return {
    query,
    results,
    loading,
    error,
    selectedIndex,

    setQuery,
    clear,

    moveUp,
    moveDown,

    selectResult,
    activeResult,
  };
}