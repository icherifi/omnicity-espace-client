import { getToken } from "./supabase/client";

export async function saveEnergyChoice(sessionId: string, strategy: string, bouquet: any) {
    const token = await getToken();
    if (!token) {
      console.error("Utilisateur non authentifié");
      return null;
    }
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/energy/choice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        sessionId,
        strategy,
        bouquet,
      }),
    });
  
    if (!res.ok) {
      throw new Error("Erreur lors de l'enregistrement du bouquet");
    }
  
    return await res.json();
  }
  