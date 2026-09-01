import type {
  LocationData,
  SavedLocation,
  RecentLocation,
} from "../types/location.types";

/**
 * ==========================================================
 * STORAGE KEYS
 * ==========================================================
 */

const STORAGE_KEYS = {
  CURRENT_LOCATION: "jpl.current.location",
  SAVED_LOCATIONS: "jpl.saved.locations",
  RECENT_LOCATIONS: "jpl.recent.locations",
} as const;

/**
 * ==========================================================
 * HELPERS
 * ==========================================================
 */

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readStorage<T>(key: string): T | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Failed to read storage key "${key}"`, error);

    return null;
  }
}

function writeStorage<T>(key: string, value: T): void {
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to write storage key "${key}"`, error);
  }
}

function removeStorage(key: string): void {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(key);
}

/**
 * ==========================================================
 * CURRENT LOCATION
 * ==========================================================
 */

export function getStoredLocation(): LocationData | null {
  return readStorage<LocationData>(STORAGE_KEYS.CURRENT_LOCATION);
}

export function saveLocation(location: LocationData): void {
  writeStorage(STORAGE_KEYS.CURRENT_LOCATION, location);
}

export function clearLocation(): void {
  removeStorage(STORAGE_KEYS.CURRENT_LOCATION);
}

/**
 * ==========================================================
 * SAVED LOCATIONS
 * ==========================================================
 */

export function getSavedLocations(): SavedLocation[] {
  return (
    readStorage<SavedLocation[]>(
      STORAGE_KEYS.SAVED_LOCATIONS
    ) ?? []
  );
}

export function saveSavedLocations(
  locations: SavedLocation[]
): void {
  writeStorage(
    STORAGE_KEYS.SAVED_LOCATIONS,
    locations
  );
}

/**
 * ==========================================================
 * RECENT LOCATIONS
 * ==========================================================
 */

export function getRecentLocations(): RecentLocation[] {
  return (
    readStorage<RecentLocation[]>(
      STORAGE_KEYS.RECENT_LOCATIONS
    ) ?? []
  );
}

export function saveRecentLocations(
  locations: RecentLocation[]
): void {
  writeStorage(
    STORAGE_KEYS.RECENT_LOCATIONS,
    locations
  );
}

/**
 * DELETE ONE RECENT LOCATION
 */

export function deleteRecentLocation(
  id: string
): RecentLocation[] {
  const updated = getRecentLocations().filter(
    (item) => item.id !== id
  );

  saveRecentLocations(updated);

  return updated;
}

/**
 * CLEAR ALL RECENT LOCATIONS
 */

export function clearRecentLocations(): void {
  removeStorage(STORAGE_KEYS.RECENT_LOCATIONS);
}
/**
 * ==========================================================
 * CLEAR EVERYTHING
 * ==========================================================
 */

export function clearLocationStorage(): void {
  clearLocation();

  removeStorage(STORAGE_KEYS.SAVED_LOCATIONS);

  removeStorage(STORAGE_KEYS.RECENT_LOCATIONS);
}