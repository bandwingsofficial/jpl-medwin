import type {
  Coordinates,
  LocationPermissionState,
} from "../types/location.types";

/**
 * ==========================================================
 * DEFAULT OPTIONS
 * ==========================================================
 */

const DEFAULT_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 300000, // 5 minutes
};

/**
 * ==========================================================
 * SUPPORT CHECK
 * ==========================================================
 */

export function isGeolocationSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "geolocation" in navigator
  );
}

/**
 * ==========================================================
 * PERMISSION STATUS
 * ==========================================================
 */

export async function getLocationPermission(): Promise<LocationPermissionState> {
  if (!isGeolocationSupported()) {
    return "denied";
  }

  if (
    typeof navigator.permissions === "undefined"
  ) {
    return "unknown";
  }

  try {
    const permission =
      await navigator.permissions.query({
        name: "geolocation",
      });

    return permission.state;
  } catch {
    return "unknown";
  }
}

/**
 * ==========================================================
 * GET CURRENT COORDINATES
 * ==========================================================
 */

export async function getCurrentCoordinates(
  options: PositionOptions = DEFAULT_OPTIONS
): Promise<Coordinates> {
  if (!isGeolocationSupported()) {
    throw new Error(
      "Geolocation is not supported by this browser."
    );
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.group("📍 Browser Geolocation");

        console.log(
          "Latitude:",
          position.coords.latitude
        );

        console.log(
          "Longitude:",
          position.coords.longitude
        );

        console.log(
          "Accuracy:",
          position.coords.accuracy,
          "meters"
        );

        console.log(
          "Altitude:",
          position.coords.altitude
        );

        console.log(
          "Heading:",
          position.coords.heading
        );

        console.log(
          "Speed:",
          position.coords.speed
        );

        console.groupEnd();

        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },

      (error) => {
        console.error("❌ Geolocation Error:", error);

        reject(error);
      },

      options
    );
  });
}

/**
 * ==========================================================
 * WATCH LOCATION
 * ==========================================================
 */

export function watchLocation(
  onSuccess: (
    coordinates: Coordinates
  ) => void,
  onError?: (
    error: GeolocationPositionError
  ) => void,
  options: PositionOptions = DEFAULT_OPTIONS
): number {
  if (!isGeolocationSupported()) {
    throw new Error(
      "Geolocation is not supported."
    );
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      onSuccess({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },

    (error) => {
      onError?.(error);
    },

    options
  );
}

/**
 * ==========================================================
 * STOP WATCHING
 * ==========================================================
 */

export function clearLocationWatch(
  watchId: number
): void {
  if (!isGeolocationSupported()) {
    return;
  }

  navigator.geolocation.clearWatch(watchId);
}