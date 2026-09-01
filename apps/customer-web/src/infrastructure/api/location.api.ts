export async function getCurrentLocation(
  latitude: number,
  longitude: number
) {
  const accessToken =
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!accessToken) {
    throw new Error(
      "NEXT_PUBLIC_MAPBOX_TOKEN is not configured"
    );
  }

  const url =
    `https://api.mapbox.com/search/geocode/v6/reverse` +
    `?longitude=${encodeURIComponent(longitude)}` +
    `&latitude=${encodeURIComponent(latitude)}` +
    `&language=en` +
    `&access_token=${encodeURIComponent(accessToken)}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "Mapbox reverse geocoding failed:",
      response.status,
      errorText
    );

    throw new Error(
      `Mapbox location request failed: ${response.status}`
    );
  }

  const data = await response.json();

  console.log(
    "Mapbox reverse geocoding response:",
    data
  );

  const result =
    data?.features?.[0];

  if (!result) {
    throw new Error(
      "Location not found from Mapbox"
    );
  }

  const properties =
    result?.properties || {};

  const context =
    properties?.context || {};

  const address =
    context?.address?.name ||
    properties?.address ||
    "";

  const street =
    context?.street?.name ||
    "";

  const city =
    context?.place?.name ||
    context?.locality?.name ||
    context?.district?.name ||
    "";

  const state =
    context?.region?.name ||
    "";

  const country =
    context?.country?.name ||
    "";

  const postalCode =
    context?.postcode?.name ||
    "";

  const addressLine2 =
    context?.neighborhood?.name ||
    context?.locality?.name ||
    "";

  const formatted =
    properties?.full_address ||
    properties?.place_formatted ||
    "";

  return {
    addressLine1:
      address ||
      street ||
      "",

    addressLine2,

    city,

    state,

    country,

    postalCode,

    formatted,
  };
}