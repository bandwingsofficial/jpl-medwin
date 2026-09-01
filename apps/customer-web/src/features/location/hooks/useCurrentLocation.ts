"use client";

import { useCallback, useEffect, useState } from "react";

import type {
  LocationData,
  LocationPermissionState,
} from "../types/location.types";

import {
  getCurrentCoordinates,
  getLocationPermission,
} from "../lib/geolocation";

import { reverseGeocode } from "../lib/location-api";

import {
  getStoredLocation,
  saveLocation,
} from "../lib/storage";

interface UseCurrentLocationReturn {
  location: LocationData | null;
  loading: boolean;
  permission: LocationPermissionState;
  error: string | null;
  refreshLocation: () => Promise<void>;
}

export function useCurrentLocation(): UseCurrentLocationReturn {
  const [location, setLocation] =
    useState<LocationData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [permission, setPermission] =
    useState<LocationPermissionState>("unknown");

  const refreshLocation =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const permissionState =
          await getLocationPermission();

        setPermission(permissionState);

        const coordinates =
          await getCurrentCoordinates();

        const currentLocation =
          await reverseGeocode(coordinates);

        setLocation(currentLocation);

        saveLocation(currentLocation);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to fetch location."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    async function initialize() {
      const cachedLocation =
        getStoredLocation();

      if (cachedLocation) {
        setLocation(cachedLocation);
      }

      await refreshLocation();
    }

    initialize();
  }, [refreshLocation]);

  return {
    location,
    loading,
    permission,
    error,
    refreshLocation,
  };
}