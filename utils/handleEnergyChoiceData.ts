import { getToken } from "./supabase/client";
import {
  KelvinInitialStateResponse,
  KelvinProjectedStateResponse,
} from "@/types/simulation.types";
import { apiFetch } from "@/utils/apiFetch";

export async function saveEnergyChoice(strategy: string, bouquet: any, projectId: string) {
  const token = await getToken();
  if (!token) {
    console.error("Utilisateur non authentifié");
    return null;
  }

  const res = await apiFetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/energy/choice`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        projectId,
        strategy,
        bouquet,
      }),
    },
  );

  if (!res.ok) {
    throw new Error("Erreur lors de l'enregistrement du bouquet");
  }

  return await res.json();
}

export async function saveEnergyChoiceWithKelvinData(
  projectId: string,
  bouquet: any,
  sessionId: string,
  initialState: KelvinInitialStateResponse | null,
  projectedState: KelvinProjectedStateResponse | null,
) {
  const token = await getToken();
  if (!token) {
    console.error("Utilisateur non authentifié");
    return null;
  }

  const res = await apiFetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/energy/choice`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        projectId,
        sessionId,
        bouquet,
        kelvinData: {
          initialState,
          projectedState,
        },
      }),
    },
  );

  if (!res.ok) {
    throw new Error("Erreur lors de l'enregistrement du bouquet");
  }

  return await res.json();
}
