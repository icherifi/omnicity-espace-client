import { NextRequest, NextResponse } from "next/server";

const KELVIN_API_BASE_URL = "https://app.go-kelvin.com/api/v2";
const KELVIN_API_TOKEN = "team-api-key-private-ajQB2M5iS7vPEguwNoZj6ncg";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dpeId = searchParams.get("dpe_id");

    if (!dpeId) {
      return NextResponse.json(
        { error: "dpe_id parameter is required" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${KELVIN_API_BASE_URL}/dpes?dpe_id=${dpeId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${KELVIN_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      let errorDetails;
      try {
        errorDetails = await response.json();
      } catch {
        errorDetails = { message: response.statusText };
      }

      console.error(`Kelvin DPE API Error [${response.status}]:`, errorDetails);

      if (response.status === 404) {
        return NextResponse.json(
          {
            error: "DPE not found",
            kelvinError: errorDetails,
            statusCode: response.status,
          },
          { status: 404 },
        );
      }

      return NextResponse.json(
        {
          error:
            errorDetails.message || errorDetails.error || "Kelvin API Error",
          kelvinError: errorDetails,
          statusCode: response.status,
        },
        { status: response.status >= 500 ? 500 : 400 },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching DPE data:", error);
    return NextResponse.json(
      {
        error: error.message || "Internal server error",
        details: error.stack,
      },
      { status: 500 },
    );
  }
}
