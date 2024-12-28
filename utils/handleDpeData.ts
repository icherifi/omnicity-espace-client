export async function fetchDpeData(dpeNumber: string) {
  const response = await fetch(
    `https://data.ademe.fr/data-fair/api/v1/datasets/dpe-v2-logements-existants/lines?page=1&q=${dpeNumber}&q_mode=simple`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  return data.results;
}
