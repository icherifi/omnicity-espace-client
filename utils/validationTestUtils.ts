/**
 * Teste et valide la fonction de sauvegarde des choix énergétiques
 * Utilitaire de débogage et validation
 */

import {
  validateBeforeSave,
  validateBouquet,
  validateKelvinData,
} from "./validationUtils";
import {
  KelvinInitialStateResponse,
  KelvinProjectedStateResponse,
} from "@/types/simulation.types";

/**
 * Données de test pour la validation
 */
export const testData = {
  // Bouquet valide
  validBouquet: {
    id: "bouquet-test-1",
    name: "Bouquet Éco",
    description: "Bouquet économique pour rénovation",
    price: 15000,
    solutions: [],
  },

  // Bouquet invalide
  invalidBouquet: {
    // Pas d'id ni de name
    description: "Bouquet sans identifiant",
    price: 10000,
  },

  // État initial valide minimal
  validInitialState: {
    status: "success",
    initial_state: {
      dpe_class: "D",
      confidence_score: 0.85,
      annual_energy_cost_range: { min: 1200, max: 1800 },
      annual_energy_consumption: 250,
      position_percentage_neighborhood: 65,
      energy_loss_percentage: {
        walls: 30,
        openings: 25,
        low_floor: 20,
        high_floor: 25,
      },
      close_to_historical_monument: false,
      living_area: 120,
      exterior_walls_surface: 150,
      house_number_of_levels: 2,
      shared_walls: false,
      wall_material: "brick",
      construction_year: 1990,
      number_of_windows: 8,
      generator_type: "gas",
    },
  } as KelvinInitialStateResponse,

  // État projeté valide minimal
  validProjectedState: {
    status: "success",
    projected_state: {
      renovation_plans: [
        {
          id: "plan-1",
          name: "Plan économique",
          type: "renovation",
          dpe_after_renovation: "B",
          yearly_energy_savings: 800,
          yearly_energy_cost: 1000,
          budget: 15000,
          subsidies: 5000,
          renovation_plan: {
            walls: {
              id: "wall-1",
              simplified_id: "w1",
              label: "Isolation des murs",
              quantity: 120,
            },
          },
        },
      ],
    },
  } as KelvinProjectedStateResponse,
};

/**
 * Tests de validation
 */
export function runValidationTests(): void {
  console.log("🧪 Démarrage des tests de validation...");

  // Test 1: Bouquet valide
  console.log("\n1️⃣ Test bouquet valide:");
  const bouquetValidation = validateBouquet(testData.validBouquet);
  console.log("Result:", bouquetValidation);

  // Test 2: Bouquet invalide
  console.log("\n2️⃣ Test bouquet invalide:");
  const invalidBouquetValidation = validateBouquet(testData.invalidBouquet);
  console.log("Result:", invalidBouquetValidation);

  // Test 3: Données Kelvin valides
  console.log("\n3️⃣ Test données Kelvin valides:");
  const kelvinValidation = validateKelvinData(
    testData.validInitialState,
    testData.validProjectedState,
  );
  console.log("Result:", kelvinValidation);

  // Test 4: Données Kelvin invalides (nulles)
  console.log("\n4️⃣ Test données Kelvin invalides:");
  const invalidKelvinValidation = validateKelvinData(null, null);
  console.log("Result:", invalidKelvinValidation);

  // Test 5: Validation complète valide
  console.log("\n5️⃣ Test validation complète valide:");
  const completeValidation = validateBeforeSave(
    "project-123",
    testData.validBouquet,
    "session-123-456",
    testData.validInitialState,
    testData.validProjectedState,
  );
  console.log("Result:", completeValidation);

  // Test 6: Validation complète avec erreurs
  console.log("\n6️⃣ Test validation complète avec erreurs:");
  const invalidCompleteValidation = validateBeforeSave(
    "", // ProjectId vide
    testData.invalidBouquet,
    "", // SessionId vide
    null, // InitialState null
    null, // ProjectedState null
  );
  console.log("Result:", invalidCompleteValidation);

  console.log("\n✅ Tests de validation terminés");
}

/**
 * Simule un appel de sauvegarde pour tester le flux complet
 */
export function simulateSaveFlow(): void {
  console.log("\n🔄 Simulation du flux de sauvegarde...");

  const projectId = "project-test-123";
  const sessionId = "session-test-456-789";

  try {
    // Validation
    const validation = validateBeforeSave(
      projectId,
      testData.validBouquet,
      sessionId,
      testData.validInitialState,
      testData.validProjectedState,
    );

    if (!validation.isValid) {
      throw new Error(
        `Validation échouée: ${validation.errors.map((e) => e.message).join(", ")}`,
      );
    }

    console.log("✅ Validation réussie");
    console.log("📝 Warnings:", validation.warnings);

    // Ici on appellerait normalement saveEnergyChoiceWithKelvinData
    console.log("💾 Appel de saveEnergyChoiceWithKelvinData...");
    console.log("📊 Données à sauvegarder:", {
      projectId,
      bouquet: testData.validBouquet.name,
      sessionId,
      hasInitialState: true,
      hasProjectedState: true,
    });

    console.log("✅ Simulation de sauvegarde terminée avec succès");
  } catch (error) {
    console.error("❌ Erreur dans le flux de sauvegarde:", error);
  }
}

// Pour exécuter les tests en mode développement
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // Ajouter les fonctions au window pour le débogage
  (window as any).testValidation = {
    runTests: runValidationTests,
    simulateFlow: simulateSaveFlow,
    testData,
  };
}
