export async function getCurrentLocation(
  latitude: number,
  longitude: number
) {
  const apiKey =
    process.env
      .NEXT_PUBLIC_OPENCAGE_API_KEY;

  const response = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch location"
    );
  }

  const data =
    await response.json();


  const result =
    data?.results?.[0];

  if (!result) {
    throw new Error(
      "Location not found"
    );
  }

  return {
    city:
      result.components.city ||
      result.components.town ||
      result.components.village ||
      result.components.state_district ||
      "Unknown",

    state:
      result.components.state || "",

    country:
      result.components.country || "",

    formatted:
      result.formatted || "",
  };
}