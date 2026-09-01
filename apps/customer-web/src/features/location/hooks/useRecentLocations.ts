"use client";

import { useCallback, useEffect, useState } from "react";

import type {
  LocationData,
  RecentLocation,
} from "../types/location.types";

import {
  getRecentLocations,
  saveRecentLocations,
} from "../lib/storage";

const MAX_RECENT_LOCATIONS = 5;

interface UseRecentLocationsReturn {
  recentLocations: RecentLocation[];
  addRecentLocation: (
    location: LocationData
  ) => void;
  removeRecentLocation: (
    id: string
  ) => void;
  clearRecentLocations: () => void;
}

export function useRecentLocations(): UseRecentLocationsReturn {
  const [recentLocations, setRecentLocations] =
    useState<RecentLocation[]>([]);

  /**
   * ---------------------------------------
   * INITIAL LOAD
   * ---------------------------------------
   */

  useEffect(() => {
    setRecentLocations(getRecentLocations());
  }, []);

  /**
   * ---------------------------------------
   * ADD
   * ---------------------------------------
   */

  const addRecentLocation =
    useCallback((location: LocationData) => {
      setRecentLocations((previous) => {
        const filtered =
          previous.filter(
            (item) =>
              item.location.formatted !==
              location.formatted
          );

        const updated: RecentLocation[] = [
          {
            id: crypto.randomUUID(),
            location,
            selectedAt:
              new Date().toISOString(),
          },
          ...filtered,
        ].slice(0, MAX_RECENT_LOCATIONS);

        saveRecentLocations(updated);

        return updated;
      });
    }, []);

  /**
   * ---------------------------------------
   * REMOVE
   * ---------------------------------------
   */

  const removeRecentLocation =
    useCallback((id: string) => {
      setRecentLocations((previous) => {
        const updated =
          previous.filter(
            (item) => item.id !== id
          );

        saveRecentLocations(updated);

        return updated;
      });
    }, []);

  /**
   * ---------------------------------------
   * CLEAR
   * ---------------------------------------
   */

  const clearRecentLocations =
    useCallback(() => {
      saveRecentLocations([]);

      setRecentLocations([]);
    }, []);

  return {
    recentLocations,

    addRecentLocation,

    removeRecentLocation,

    clearRecentLocations,
  };
}