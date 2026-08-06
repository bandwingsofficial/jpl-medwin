"use client";

import { useEffect, useState } from "react";

import { getCurrentLocation } from "@/infrastructure/api/location.api";

interface LocationData {
  city: string;
  state: string;
  country: string;
  formatted: string;
}

export function useCurrentLocation() {
  /*
   |------------------------------------------------------------------
   | STATES
   |------------------------------------------------------------------
   */

  const [location, setLocation] =
    useState<LocationData | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  /*
   |------------------------------------------------------------------
   | LOCATION FETCH
   |------------------------------------------------------------------
   */

  useEffect(() => {
    // =========================================
    // GEOLOCATION NOT SUPPORTED
    // =========================================

    if (
      !navigator.geolocation
    ) {
   

      setLoading(false);

      return;
    }

    // =========================================
    // GET CURRENT POSITION
    // =========================================

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // =========================================
          // COORDINATES
          // =========================================

          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;


          // =========================================
          // FETCH LOCATION
          // =========================================

          const data =
            await getCurrentLocation(
              latitude,
              longitude
            );


          // =========================================
          // SET LOCATION
          // =========================================

          setLocation(data);
        } catch (error) {
        } finally {
          setLoading(false);
        }
      },

      // =========================================
      // LOCATION ERROR
      // =========================================

      (error) => {
        

        setLoading(false);
      },

      // =========================================
      // LOCATION OPTIONS
      // =========================================

      {
        enableHighAccuracy: true,

        timeout: 10000,

        maximumAge: 0,
      }
    );
  }, []);

  /*
   |------------------------------------------------------------------
   | RETURN
   |------------------------------------------------------------------
   */

  return {
    location,
    loading,
  };
}