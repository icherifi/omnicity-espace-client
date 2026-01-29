export interface KelvinDpeData {
  dpe_id: string;
  building_type: string;
  ban_id: string;
  energy_class: string;
  emission_class: string;
  surface: number;
  report_date: string;
  address: string;
  address_complement?: string;
  dpe_version: string;
}

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  address: string;
}

export interface SimulationResponse {
  simulation_id: string;
}

export interface RenovationPlan {
  id: string;
  name: string;
  type: string;
  dpe_after_renovation: string;
  yearly_energy_savings: number;
  yearly_energy_cost: number;
  budget: number;
  subsidies: number;
  renovation_plan: {
    vents?: any;
    walls?: any;
    windows?: any;
    low_floor?: any;
    high_floor?: any;
    generator_type?: any;
    generator_energy?: any;
    hot_water_type?: any;
    hot_water_energy?: any;
  };
}

export interface ProjectedStateResponse {
  status: string;
  projected_state: {
    renovation_plans: RenovationPlan[];
  };
}

/**
 * Récupère les informations DPE via notre API route (évite les problèmes CORS)
 * @param dpeId - L'identifiant DPE
 * @returns Les données DPE ou null si non trouvé
 */
export async function fetchDpeData(
  dpeId: string,
): Promise<KelvinDpeData | null> {
  try {
    const response = await fetch(`/api/kelvin/dpe?dpe_id=${dpeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // DPE non trouvé
      }
      const errorData = await response.json().catch(() => ({}));
      console.error("Erreur API DPE:", errorData);
      throw new Error(
        errorData.error ||
          errorData.kelvinError?.message ||
          `Erreur API DPE: ${response.status}`,
      );
    }

    const data = await response.json();

    // L'API retourne un tableau, on prend le premier élément
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }

    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération des données DPE:", error);
    throw new Error(
      "Impossible de récupérer les données DPE. Veuillez réessayer.",
    );
  }
}

/**
 * Formate la date de rapport DPE
 * @param dateString - Date au format ISO
 * @returns Date formatée en français
 */
export function formatDpeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Obtient la couleur associée à une classe énergétique
 * @param energyClass - Classe énergétique (A, B, C, D, E, F, G)
 * @returns Couleur CSS
 */
export function getEnergyClassColor(energyClass: string): string {
  const colorMap: Record<string, string> = {
    A: "!bg-green-600 hover:!bg-green-600",
    B: "!bg-green-500 hover:!bg-green-500",
    C: "!bg-yellow-500 hover:!bg-yellow-500",
    D: "!bg-orange-500 hover:!bg-orange-500",
    E: "!bg-red-500 hover:!bg-red-500",
    F: "!bg-red-600 hover:!bg-red-600",
    G: "!bg-red-700 hover:!bg-red-700",
  };

  return (
    colorMap[energyClass.toUpperCase()] || "!bg-gray-500 hover:!bg-gray-500"
  );
}

/**
 * Obtient la description d'une classe énergétique
 * @param energyClass - Classe énergétique
 * @returns Description de la performance
 */
export function getEnergyClassDescription(energyClass: string): string {
  const descriptions: Record<string, string> = {
    A: "Très performant",
    B: "Performant",
    C: "Assez performant",
    D: "Peu performant",
    E: "Peu performant",
    F: "Très peu performant",
    G: "Extrêmement peu performant",
  };

  return descriptions[energyClass.toUpperCase()] || "Non défini";
}

/**
 * Géocode une adresse avec Mapbox pour récupérer latitude/longitude
 * @param address - Adresse à géocoder
 * @returns Coordonnées géographiques
 */
export async function geocodeAddress(
  address: string,
): Promise<GeocodeResult | null> {
  try {
    const response = await fetch(
      `/api/mapbox/geocode?address=${encodeURIComponent(address)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Adresse non trouvée
      }
      const errorData = await response.json().catch(() => ({}));
      console.error("Erreur géocodage:", errorData);
      throw new Error(
        errorData.error || `Erreur géocodage: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors du géocodage:", error);
    throw new Error("Impossible de géocoder l'adresse. Veuillez réessayer.");
  }
}

/**
 * Crée une nouvelle simulation Kelvin
 * @param latitude - Latitude
 * @param longitude - Longitude
 * @param banId - BAN ID du bâtiment
 * @returns ID de simulation
 */
export async function createSimulation(
  latitude: number,
  longitude: number,
  banId: string,
): Promise<string | null> {
  try {
    const response = await fetch("/api/kelvin/simulation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude,
        longitude,
        ban_id: banId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Erreur création simulation:", errorData);
      throw new Error(
        errorData.error ||
          errorData.kelvinError?.message ||
          `Erreur création simulation: ${response.status}`,
      );
    }

    const data: SimulationResponse = await response.json();
    return data.simulation_id;
  } catch (error) {
    console.error("Erreur lors de la création de simulation:", error);
    throw new Error("Impossible de créer la simulation. Veuillez réessayer.");
  }
}

/**
 * Lance une simulation Kelvin
 * @param simulationId - ID de la simulation
 */
export async function runSimulation(simulationId: string): Promise<void> {
  try {
    const response = await fetch(`/api/kelvin/simulation/${simulationId}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Erreur lancement simulation:", errorData);
      throw new Error(
        errorData.error ||
          errorData.kelvinError?.message ||
          `Erreur lancement simulation: ${response.status}`,
      );
    }
  } catch (error) {
    console.error("Erreur lors du lancement de simulation:", error);
    throw new Error("Impossible de lancer la simulation. Veuillez réessayer.");
  }
}

/**
 * Récupère l'état projeté d'une simulation
 * @param simulationId - ID de la simulation
 * @returns État projeté avec plans de rénovation
 */
export async function getProjectedState(
  simulationId: string,
): Promise<ProjectedStateResponse> {
  try {
    const response = await fetch(
      `/api/kelvin/simulation/${simulationId}/projected-state`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Erreur état projeté:", errorData);
      throw new Error(
        errorData.error ||
          errorData.kelvinError?.message ||
          `Erreur récupération état: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération de l'état projeté:", error);
    throw new Error(
      "Impossible de récupérer l'état projeté. Veuillez réessayer.",
    );
  }
}

/**
 * Lance le processus complet de simulation Kelvin
 * @param dpeData - Données DPE
 * @returns Plans de rénovation avec données enrichies
 */
export async function runCompleteSimulation(
  dpeData: KelvinDpeData,
): Promise<any> {
  try {
    console.log("🚀 Démarrage simulation complète pour DPE:", dpeData.dpe_id);

    // 1. Géocodage de l'adresse
    console.log("📍 Géocodage adresse:", dpeData.address);
    const geocodeResult = await geocodeAddress(dpeData.address);

    if (!geocodeResult) {
      throw new Error("Impossible de géocoder l'adresse");
    }

    console.log("📍 Coordonnées trouvées:", geocodeResult);

    // 2. Création de la simulation
    console.log("🔧 Création simulation...");
    const simulationId = await createSimulation(
      geocodeResult.latitude,
      geocodeResult.longitude,
      dpeData.ban_id,
    );

    if (!simulationId) {
      throw new Error("Impossible de créer la simulation");
    }

    console.log("🔧 Simulation créée avec ID:", simulationId);

    // 3. Lancement de la simulation
    console.log("▶️ Lancement simulation...");
    await runSimulation(simulationId);
    console.log("▶️ Simulation lancée");

    // 4. Attente et récupération de l'état projeté (avec retry)
    console.log("⏳ Récupération état projeté...");
    let attempts = 0;
    const maxAttempts = 10;
    let projectedState: ProjectedStateResponse;

    while (attempts < maxAttempts) {
      try {
        projectedState = await getProjectedState(simulationId);
        if (projectedState.status === "completed") {
          break;
        }
        console.log(
          `⏳ Simulation en cours (${projectedState.status}), tentative ${attempts + 1}/${maxAttempts}`,
        );
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Attendre 3 secondes
        attempts++;
      } catch (error) {
        attempts++;
        if (attempts === maxAttempts) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    if (attempts === maxAttempts) {
      throw new Error("Timeout: La simulation a pris trop de temps");
    }

    console.log("✅ Simulation terminée avec succès");

    // 5. Enrichissement des données
    const enrichedData = {
      realDpeData: dpeData,
      geocodeResult,
      simulationId,
      projectedState: projectedState!,
      dpeData: {
        energyClass: dpeData.energy_class,
        emissionClass: dpeData.emission_class,
        surface: dpeData.surface,
        address: dpeData.address,
        addressComplement: dpeData.address_complement || null,
        buildingType: dpeData.building_type,
        reportDate: dpeData.report_date,
        dpeVersion: dpeData.dpe_version,
        banId: dpeData.ban_id,
        coordinates: {
          latitude: geocodeResult.latitude,
          longitude: geocodeResult.longitude,
        },
      },
      energyResults: {
        bouquets: projectedState!.projected_state.renovation_plans.map(
          (plan) => ({
            id: plan.id,
            name: plan.name,
            type: plan.type,
            dpeAfter: plan.dpe_after_renovation,
            yearlyEnergySavings: plan.yearly_energy_savings,
            yearlyEnergyCost: plan.yearly_energy_cost,
            budget: plan.budget,
            subsidies: plan.subsidies,
            renovationDetails: plan.renovation_plan,
          }),
        ),
      },
    };

    console.log("📊 Données enrichies:", enrichedData);
    return enrichedData;
  } catch (error) {
    console.error("❌ Erreur simulation complète:", error);
    throw error;
  }
}
