import { getToken } from "./supabase/client"; 

export async function fetchDpeFormData(newProjectDpeFormData: {
  dpeNumber: string;
  fiscalIncome: string;
  householdSize: string;
  occupancyStatus: string;
  baseValue: string;
}) {
  const token = await getToken();
  if (!token) {
    throw new Error("Not authenticated");
  }
  
  const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/energy/form/auto-fill`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify(newProjectDpeFormData),
  });

  if (!resp.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await resp.json();
  return data;
}

