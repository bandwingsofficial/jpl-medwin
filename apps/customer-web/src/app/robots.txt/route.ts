import { NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export async function GET(): Promise<Response> {
  try {
    const response = await fetch(`${API_URL}/robots.txt`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return new NextResponse("User-agent: *\nAllow: /\n", {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    const robots = await response.text();

    return new NextResponse(robots, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch {
    return new NextResponse("User-agent: *\nAllow: /\n", {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}