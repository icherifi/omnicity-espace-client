import { NextRequest, NextResponse } from "next/server";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "address parameter is required" },
        { status: 400 },
      );
    }

    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=fr&limit=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Mapbox API Error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    const feature = data.features[0];
    const [longitude, latitude] = feature.center;

    return NextResponse.json({
      latitude,
      longitude,
      address: feature.place_name,
    });
  } catch (error) {
    console.error("Error geocoding address:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
