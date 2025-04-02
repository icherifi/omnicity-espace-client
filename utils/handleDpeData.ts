import { getToken } from "./supabase/client"; 

export async function fetchDpeData(dpeNumber: string) {
  const token = await getToken();
  if (!token) {
    throw new Error("Not authenticated");
  }
  
  const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/energy/dpe/${dpeNumber}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await resp.json();
  return data;
}

