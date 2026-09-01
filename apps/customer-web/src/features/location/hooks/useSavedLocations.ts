"use client";

import { useCallback, useEffect, useState } from "react";

import type {
  SavedLocation,
} from "../types/location.types";

import {
  getSavedLocations,
  saveSavedLocations,
} from "../lib/storage";

interface UseSavedLocationsReturn {
  savedLocations: SavedLocation[];

  addSavedLocation: (
    location: SavedLocation
  ) => void;

  updateSavedLocation: (
    location: SavedLocation
  ) => void;

  removeSavedLocation: (
    id: string
  ) => void;

  setDefaultLocation: (
    id: string
  ) => void;

  clearSavedLocations: () => void;
}

export function useSavedLocations(): UseSavedLocationsReturn {
  const [savedLocations, setSavedLocations] =
    useState<SavedLocation[]>([]);

  /**
   * ------------------------------------------------
   * LOAD
   * ------------------------------------------------
   */

  useEffect(() => {
    setSavedLocations(getSavedLocations());
  }, []);

  /**
   * ------------------------------------------------
   * ADD
   * ------------------------------------------------
   */

  const addSavedLocation =
    useCallback((location: SavedLocation) => {
      setSavedLocations((previous) => {
        const updated = [
          ...previous,
          location,
        ];

        saveSavedLocations(updated);

        return updated;
      });
    }, []);

  /**
   * ------------------------------------------------
   * UPDATE
   * ------------------------------------------------
   */

  const updateSavedLocation =
    useCallback((location: SavedLocation) => {
      setSavedLocations((previous) => {
        const updated = previous.map(
          (item) =>
            item.id === location.id
              ? location
              : item
        );

        saveSavedLocations(updated);

        return updated;
      });
    }, []);

  /**
   * ------------------------------------------------
   * REMOVE
   * ------------------------------------------------
   */

  const removeSavedLocation =
    useCallback((id: string) => {
      setSavedLocations((previous) => {
        const updated = previous.filter(
          (item) => item.id !== id
        );

        saveSavedLocations(updated);

        return updated;
      });
    }, []);

  /**
   * ------------------------------------------------
   * SET DEFAULT
   * ------------------------------------------------
   */

  const setDefaultLocation =
    useCallback((id: string) => {
      setSavedLocations((previous) => {
        const updated = previous.map(
          (item) => ({
            ...item,
            isDefault: item.id === id,
          })
        );

        saveSavedLocations(updated);

        return updated;
      });
    }, []);

  /**
   * ------------------------------------------------
   * CLEAR
   * ------------------------------------------------
   */

  const clearSavedLocations =
    useCallback(() => {
      saveSavedLocations([]);

      setSavedLocations([]);
    }, []);

  return {
    savedLocations,

    addSavedLocation,

    updateSavedLocation,

    removeSavedLocation,

    setDefaultLocation,

    clearSavedLocations,
  };
}