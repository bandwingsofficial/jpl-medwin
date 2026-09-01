import { NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export async function GET(): Promise<NextResponse> {
  try {
    const response = await fetch(`${API_URL}/sitemap.xml`, {
      headers: {
        Accept: "application/xml",
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      return new NextResponse("Failed to fetch sitemap", {
        status: 502,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    const xml = await response.text();

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control":
          "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new NextResponse("Failed to fetch sitemap", {
      status: 500,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}