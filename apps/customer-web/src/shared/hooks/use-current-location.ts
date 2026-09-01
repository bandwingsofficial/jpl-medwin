"use client";

import { useEffect, useState } from "react";
import { getCurrentLocation } from "@/infrastructure/api/location.api";

interface LocationData {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  formatted: string;
}

export function useCurrentLocation() {
  const [location, setLocation] =
    useState<LocationData | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;

          const data =
            await getCurrentLocation(
              latitude,
              longitude
            );

          // THIS WAS MISSING
          setLocation(data);
        } catch (error) {
          console.error(
            "Failed to fetch current location:",
            error
          );
        } finally {
          setLoading(false);
        }
      },

      (error) => {
        console.error(
          "Geolocation error:",
          error
        );

        setLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return {
    location,
    loading,
  };
}