import { useState } from "react";

interface SimulationData {
  latitude: number;
  longitude: number;
  banId: string;
  address: any;
  inputAddress: string;
}

export function useKelvinSimulation() {
  const [loading, setLoading] = useState(false);

  const runSimulation = async (data: SimulationData) => {
    setLoading(true);

    try {
      console.log("🚀 Démarrage du processus de simulation Kelvin...");
      console.log("📍 Données de sélection:", {
        latitude: data.latitude,
        longitude: data.longitude,
        banId: data.banId,
        address: data.address,
      });

      // Étape 1: Créer la simulation
      console.log("📋 Étape 1: Création de la simulation...");
      const createResponse = await fetch("/api/kelvin/simulation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: data.latitude,
          longitude: data.longitude,
          ban_id: data.banId,
        }),
      });

      if (!createResponse.ok) {
        const error = await createResponse.json();
        throw new Error(
          error.error ||
            `Erreur création simulation (${createResponse.status})`,
        );
      }

      const simulationData = await createResponse.json();
      console.log("✅ Simulation créée:", simulationData);

      const simulationId = simulationData.simulation_id;
      if (!simulationId) {
        throw new Error("ID de simulation manquant dans la réponse");
      }

      // Étape 2: Lancer la simulation
      console.log("🏃 Étape 2: Lancement de la simulation...");
      const runResponse = await fetch(
        `/api/kelvin/simulation/${simulationId}/run`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!runResponse.ok) {
        const error = await runResponse.json();
        throw new Error(
          error.error || `Erreur lancement simulation (${runResponse.status})`,
        );
      }

      const runData = await runResponse.json();
      console.log("✅ Simulation lancée:", runData);

      // Étape 3: Attendre et récupérer les résultats projetés
      console.log("⏳ Étape 3: Attente et récupération des résultats...");
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const projectedResponse = await fetch(
        `/api/kelvin/simulation/${simulationId}/projected-state`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!projectedResponse.ok) {
        const error = await projectedResponse.json();
        throw new Error(
          error.error ||
            `Erreur récupération résultats (${projectedResponse.status})`,
        );
      }

      const projectedState = await projectedResponse.json();
      console.log("✅ Résultats projetés récupérés:", projectedState);

      // Étape 4 (optionnelle): Récupérer les données DPE si disponibles
      let dpeData = null;
      if (projectedState.dpe_id) {
        try {
          console.log("📊 Étape 4: Récupération des données DPE...");
          const dpeResponse = await fetch(
            `/api/kelvin/dpe?dpe_id=${projectedState.dpe_id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          if (dpeResponse.ok) {
            dpeData = await dpeResponse.json();
            console.log("✅ Données DPE récupérées:", dpeData);
          } else {
            console.warn("⚠️ Impossible de récupérer les données DPE");
          }
        } catch (dpeError) {
          console.warn("⚠️ Erreur récupération DPE:", dpeError);
        }
      }

      // Consolider tous les résultats
      const finalResults = {
        simulation: simulationData,
        run: runData,
        projectedState: projectedState,
        dpe: dpeData,
        selection: {
          latitude: data.latitude,
          longitude: data.longitude,
          banId: data.banId,
          address: data.address,
          inputAddress: data.inputAddress,
        },
      };

      console.log("🎉 RÉSULTATS FINAUX COMPLETS:", finalResults);
      return finalResults;
    } catch (error: any) {
      console.error("💥 Erreur lors du processus de simulation:", error);
      throw new Error(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatResultsForEnergyMix = (
    simulationResults: any,
    address: string,
    selectedData: any,
  ) => {
    console.log("📊 Formatage des résultats pour EnergyMixSolutions...");

    const projectedState = simulationResults.projectedState;
    const dpeData = simulationResults.dpe;

    // Mapper les plans de rénovation Kelvin vers le format EnergyMixSolutions
    let bouquets = [];
    if (projectedState.projected_state?.renovation_plans) {
      bouquets = projectedState.projected_state.renovation_plans.map(
        (plan: any) => {
          // Mapper les étiquettes DPE (A, B, C, D, E, F, G)
          const etiquetteMapping: { [key: string]: number } = {
            G: 450,
            F: 330,
            E: 250,
            D: 180,
            C: 110,
            B: 70,
            A: 30,
          };

          const cep = etiquetteMapping[plan.dpe_after_renovation] || 250;
          const resteACharge = plan.budget - plan.subsidies;

          // Créer la liste des détails de prix à partir du plan de rénovation
          const detailsPrix: any[] = [];
          const renovationPlan = plan.renovation_plan || {};

          // Estimation des coûts par type de travaux (approximatifs)
          const coutEstimations: { [key: string]: number } = {
            high_floor: 1500,
            walls: 15000,
            vents: 3000,
            windows: 8000,
            low_floor: 4000,
            generator_type: 12000,
          };

          Object.entries(renovationPlan).forEach(
            ([key, value]: [string, any]) => {
              if (value && typeof value === "object" && value.label) {
                const cout =
                  coutEstimations[key] ||
                  Math.floor(plan.budget / Object.keys(renovationPlan).length);
                detailsPrix.push({
                  nom: value.label,
                  prix: cout,
                });
              }
            },
          );

          return {
            CEP: cep,
            EGES: Math.floor(cep / 8), // Estimation EGES basée sur CEP
            confort:
              plan.name === "advanced"
                ? 5
                : plan.name === "intermediate"
                  ? 4
                  : 3,
            etiquetteEnergetique: plan.dpe_after_renovation,
            etiquetteEGES: plan.dpe_after_renovation,
            etiquette: plan.dpe_after_renovation,
            pourcentageGainCEP: Math.floor(
              (plan.yearly_energy_savings / 2500) * 100,
            ),
            valeurVerte: Math.floor(plan.yearly_energy_savings * 10),
            coutTotal: plan.budget,
            montantAides: plan.subsidies,
            resteACharge: resteACharge,
            detailsPrix: detailsPrix,
            // Déduction des travaux à partir du plan
            renoMenuiserie: !!renovationPlan.windows,
            renovationMurs: !!renovationPlan.walls,
            renoComblesPerdus: !!renovationPlan.high_floor,
            renoPorteFenetres: !!renovationPlan.windows,
            renoComblesAmenages: false,
            renoPlancherBasSousSol: !!renovationPlan.low_floor,
            renoPlancherBasTerrePlein: false,
            renoIsolationToitureTerrasse: false,
            renoPlancherBasVideSanitaire: false,
            appareilChauffage1: renovationPlan.generator_type?.label || null,
            appareilChauffage2: null,
            typeVentilationExterieur: renovationPlan.vents?.label || null,
            remplacementEauChaudeSanitaire:
              renovationPlan.generator_type?.label?.includes("double service")
                ? "Thermodynamique"
                : null,
            categoriesAides:
              plan.subsidies > 5000 ? "MaPrimeRénov + CEE" : "MaPrimeRénov",
          };
        },
      );
    }

    console.log("📊 Bouquets énergétiques mappés:", bouquets);

    // Formater les données pour EnergyMixSolutions
    const formattedResults = {
      sessionId: `address-session-${Date.now()}`,
      CEP: 254, // Valeur initiale estimée
      EGES: 53,
      confort: 2,
      etiquetteEnergetique: "C",
      etiquetteEGES: "D",
      etiquette: "D",
      etiquetteInitial: "D",
      etiquetteEGESInitial: "D",
      etiquetteEnergetiqueInitial: "D",
      bouquets: bouquets,
      address: address,
      coordinates: {
        latitude: selectedData.latitude,
        longitude: selectedData.longitude,
      },
      banId: selectedData.banId,
      detailedAddress: selectedData.address,
      timestamp: new Date().toISOString(),
      // Données de performance énergétique (peuvent être étendues avec plus de détails de l'API)
      performanceEnergetique: {
        murs: {
          EtatInitial: {
            Note: 2,
            Label: "Isolation insuffisante",
            Description: "Murs peu isolés",
          },
          EtatRenove: {
            Note: 4,
            Label: "Bien isolé",
            Description: "Isolation performante",
          },
        },
        toiture: {
          EtatInitial: {
            Note: 1,
            Label: "Non isolé",
            Description: "Combles sans isolation",
          },
          EtatRenove: {
            Note: 5,
            Label: "Très bien isolé",
            Description: "Isolation renforcée",
          },
        },
        chauffage: {
          EtatInitial: {
            Note: 2,
            Label: "Système ancien",
            Description: "Rendement faible",
          },
          EtatRenove: {
            Note: 5,
            Label: "Système moderne",
            Description: "Haute performance",
          },
        },
      },
      ...(dpeData || {}),
    };

    return formattedResults;
  };

  return {
    loading,
    runSimulation,
    formatResultsForEnergyMix,
  };
}
