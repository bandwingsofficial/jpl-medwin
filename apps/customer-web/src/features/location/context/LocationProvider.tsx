"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { LocationData } from "../types/location.types";

import {
  getStoredLocation,
  saveLocation,
  clearLocation,
} from "../lib/storage";

import { reverseGeocode } from "../lib/location-api";
import {
  getCurrentCoordinates,
  getLocationPermission,
} from "../lib/geolocation";

import type { LocationPermissionState } from "../types/location.types";

interface LocationContextValue {
  location: LocationData | null;

  loading: boolean;

  permission: LocationPermissionState;

  error: string | null;

  setLocation: (
    location: LocationData
  ) => void;

  clearSelectedLocation: () => void;

  refreshCurrentLocation: () => Promise<LocationData | null>;
}

const LocationContext =
  createContext<LocationContextValue | null>(
    null
  );

interface LocationProviderProps {
  children: ReactNode;
}

export function LocationProvider({
  children,
}: LocationProviderProps) {
  const [location, setLocationState] =
    useState<LocationData | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [permission, setPermission] =
    useState<LocationPermissionState>(
      "unknown"
    );

  const [error, setError] =
    useState<string | null>(null);

  /**
   * ---------------------------------------
   * LOAD STORED LOCATION
   * ---------------------------------------
   */

  useEffect(() => {
    const stored =
      getStoredLocation();

    if (stored) {
      setLocationState(stored);
    }

    getLocationPermission().then(
      setPermission
    );
  }, []);

  /**
   * ---------------------------------------
   * SET LOCATION
   * ---------------------------------------
   */

  const setLocation =
    useCallback(
      (location: LocationData) => {
        saveLocation(location);
        setLocationState(location);
      },
      []
    );

  /**
   * ---------------------------------------
   * CLEAR
   * ---------------------------------------
   */

  const clearSelectedLocation =
    useCallback(() => {
      clearLocation();
      setLocationState(null);
    }, []);

  /**
   * ---------------------------------------
   * REFRESH GPS LOCATION
   * ---------------------------------------
   */

  const refreshCurrentLocation =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const permission =
          await getLocationPermission();

        setPermission(permission);

        const coordinates =
          await getCurrentCoordinates();

        const latest =
          await reverseGeocode(
            coordinates
          );

        saveLocation(latest);

        setLocationState(latest);

        return latest;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to determine your location."
        );

        return null;
      } finally {
        setLoading(false);
      }
    }, []);

  const value = useMemo(
    () => ({
      location,

      loading,

      permission,

      error,

      setLocation,

      clearSelectedLocation,

      refreshCurrentLocation,
    }),
    [
      location,
      loading,
      permission,
      error,
      setLocation,
      clearSelectedLocation,
      refreshCurrentLocation,
    ]
  );

  return (
    <LocationContext.Provider
      value={value}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context =
    useContext(LocationContext);

  if (!context) {
    throw new Error(
      "useLocation must be used inside LocationProvider."
    );
  }

  return context;
}