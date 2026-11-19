import { apiFetch } from "@/utils/apiFetch";
export const saveDpeFormToDb = async (dpeFormData: any, projectId: string, token: string) => {
  const resp = await apiFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dpe/save-form`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      projectId,
      dpeFormData
    }),
  });

  if (!resp.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await resp.json();
  return data;
}