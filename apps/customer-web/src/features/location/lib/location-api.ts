import type {
  Coordinates,
  LocationData,
  ReverseGeocodeResponse,
} from "../types/location.types";

/**
 * ==========================================================
 * CONFIG
 * ==========================================================
 */

const REVERSE_API =
  "https://nominatim.openstreetmap.org/reverse";

const SEARCH_API =
  "https://nominatim.openstreetmap.org/search";

/**
 * ==========================================================
 * COMMON HEADERS
 * ==========================================================
 */

const REQUEST_HEADERS = {
  Accept: "application/json",
};

/**
 * ==========================================================
 * REVERSE GEOCODE
 * ==========================================================
 */

export async function reverseGeocode(
  coordinates: Coordinates
): Promise<LocationData> {
  const params = new URLSearchParams({
    lat: coordinates.latitude.toString(),
    lon: coordinates.longitude.toString(),
    format: "jsonv2",
    addressdetails: "1",
    "accept-language": "en",
  });

  const response = await fetch(
    `${REVERSE_API}?${params.toString()}`,
    {
      headers: REQUEST_HEADERS,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Unable to fetch current location.");
  }

  const data = await response.json();

  const address = data.address ?? {};

  const location: ReverseGeocodeResponse = {
    locality:
      address.suburb ||
      address.neighbourhood ||
      address.city_district ||
      address.residential ||
      address.quarter ||
      "",

    city:
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.county ||
      "",

    state:
      address.state || "",

    country:
      address.country || "",

    countryCode:
      address.country_code?.toUpperCase() || "",

    postalCode:
      address.postcode || "",

    formatted:
      data.display_name || "",
  };

  return {
    ...location,
    coordinates,
  };
}

/**
 * ==========================================================
 * SEARCH LOCATIONS
 * ==========================================================
 */

export async function searchLocations(
  query: string,
  signal?: AbortSignal,
  limit = 8
): Promise<LocationData[]> {
  if (!query.trim()) {
    return [];
  }

  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    addressdetails: "1",
    countrycodes: "in",
    limit: String(limit),
    "accept-language": "en",
  });

  const response = await fetch(
    `${SEARCH_API}?${params.toString()}`,
    {
      signal,
      headers: REQUEST_HEADERS,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Unable to search locations.");
  }

  const data = await response.json();

  return (
    data?.map(
      (item: any): LocationData => ({
        locality:
          item.address?.suburb ||
          item.address?.neighbourhood ||
          item.address?.city_district ||
          item.address?.residential ||
          item.address?.quarter ||
          "",

        city:
          item.address?.city ||
          item.address?.town ||
          item.address?.village ||
          item.address?.municipality ||
          item.address?.county ||
          "",

        state:
          item.address?.state || "",

        country:
          item.address?.country || "",

        countryCode:
          item.address?.country_code?.toUpperCase() ||
          "",

        postalCode:
          item.address?.postcode || "",

        formatted:
          item.display_name || "",

        coordinates: {
          latitude: Number(item.lat),
          longitude: Number(item.lon),
        },
      })
    ) ?? []
  );
}