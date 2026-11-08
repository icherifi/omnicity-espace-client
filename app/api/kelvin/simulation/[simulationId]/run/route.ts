import { NextRequest, NextResponse } from "next/server";

const KELVIN_API_BASE_URL = "https://app.go-kelvin.com/api/v2";
const KELVIN_API_TOKEN = process.env.KELVIN_API_TOKEN ?? "";

export async function POST(
  request: NextRequest,
  { params }: { params: { simulationId: string } },
) {
  try {
    const { simulationId } = params;

    if (!simulationId) {
      return NextResponse.json(
        { error: "simulationId is required" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${KELVIN_API_BASE_URL}/simulations/${simulationId}/run`,
      {
        method: "POST",
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

      console.error(
        `Kelvin Run Simulation API Error [${response.status}]:`,
        errorDetails,
      );

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

    // L'API Kelvin /run peut retourner du HTML ou une réponse vide
    // On vérifie le Content-Type pour savoir si c'est du JSON
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch (jsonError) {
        console.warn(
          "Failed to parse JSON response from Kelvin run API:",
          jsonError,
        );
        data = { success: true, message: "Simulation started successfully" };
      }
    } else {
      // Si ce n'est pas du JSON, on considère que c'est un succès
      console.log(
        "Kelvin run API returned non-JSON response, treating as success",
      );
      data = { success: true, message: "Simulation started successfully" };
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error running simulation:", error);
    return NextResponse.json(
      {
        error: error.message || "Internal server error",
        details: error.stack,
      },
      { status: 500 },
    );
  }
}
