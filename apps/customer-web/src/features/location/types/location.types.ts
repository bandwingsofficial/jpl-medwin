/**
 * ==========================================================
 * LOCATION FEATURE TYPES
 * ==========================================================
 */

export type LocationPermissionState =
  | "unknown"
  | "granted"
  | "denied"
  | "prompt";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationData {
  /**
   * Area / Locality
   * Example:
   * Koramangala
   * Indiranagar
   * Malleshwaram
   */
  locality: string;

  /**
   * City
   * Example:
   * Bengaluru
   */
  city: string;

  /**
   * State
   * Example:
   * Karnataka
   */
  state: string;

  /**
   * Country
   * Example:
   * India
   */
  country: string;

  /**
   * ISO Country Code
   * Example:
   * IN
   */
  countryCode: string;

  /**
   * Pincode / ZIP Code
   * Example:
   * 560034
   */
  postalCode: string;

  /**
   * Full formatted address
   */
  formatted: string;

  /**
   * Latitude & Longitude
   */
  coordinates: Coordinates;
}

export interface SavedLocation {
  id: string;
  label: string; // Home, Office, Warehouse etc.

  location: LocationData;

  isDefault: boolean;

  createdAt: string;

  updatedAt: string;
}

export interface RecentLocation {
  id: string;

  location: LocationData;

  selectedAt: string;
}

export interface PopularCity {
  id: string;

  name: string;

  state: string;

  country: string;
}

export interface LocationState {
  location: LocationData | null;

  loading: boolean;

  permission: LocationPermissionState;

  error: string | null;
}

export interface ReverseGeocodeResponse {
  locality: string;

  city: string;

  state: string;

  country: string;

  countryCode: string;

  postalCode: string;

  formatted: string;
}