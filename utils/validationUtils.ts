import {
  KelvinInitialStateResponse,
  KelvinProjectedStateResponse,
} from "@/types/simulation.types";

/**
 * Interface pour les erreurs de validation
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * Résultat de validation
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

/**
 * Valide qu'un bouquet énergétique a les propriétés requises
 */
export function validateBouquet(bouquet: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  if (!bouquet) {
    errors.push({
      field: "bouquet",
      message: "Aucun bouquet fourni",
      code: "MISSING_BOUQUET",
    });
    return { isValid: false, errors, warnings };
  }

  // Vérifications optionnelles avec warnings
  if (!bouquet.price && bouquet.price !== 0) {
    warnings.push("Prix du bouquet non défini");
  }

  if (!bouquet.description) {
    warnings.push("Description du bouquet manquante");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Valide les données Kelvin (initial et projected state)
 */
export function validateKelvinData(
  initialState: KelvinInitialStateResponse | null,
  projectedState: KelvinProjectedStateResponse | null,
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  // Validation de l'état initial
  if (!initialState) {
    errors.push({
      field: "initialState",
      message: "État initial manquant",
      code: "MISSING_INITIAL_STATE",
    });
  } else {
    if (!initialState.initial_state) {
      errors.push({
        field: "initialState.initial_state",
        message: "Données de l'état initial manquantes",
        code: "MISSING_INITIAL_DATA",
      });
    } else {
      // Vérifications spécifiques pour l'état initial
      if (!initialState.initial_state.dpe_class) {
        warnings.push("Classe DPE manquante dans l'état initial");
      }
      if (!initialState.initial_state.annual_energy_consumption) {
        warnings.push(
          "Consommation énergétique annuelle manquante dans l'état initial",
        );
      }
    }
  }

  // Validation de l'état projeté
  if (!projectedState) {
    errors.push({
      field: "projectedState",
      message: "État projeté manquant",
      code: "MISSING_PROJECTED_STATE",
    });
  } else {
    if (!projectedState.projected_state) {
      errors.push({
        field: "projectedState.projected_state",
        message: "Données de l'état projeté manquantes",
        code: "MISSING_PROJECTED_DATA",
      });
    } else {
      if (
        !projectedState.projected_state.renovation_plans ||
        projectedState.projected_state.renovation_plans.length === 0
      ) {
        warnings.push("Aucun plan de rénovation trouvé dans l'état projeté");
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validation complète avant sauvegarde
 */
export function validateBeforeSave(
  projectId: string,
  bouquet: any,
  sessionId: string,
  initialState: KelvinInitialStateResponse | null,
  projectedState: KelvinProjectedStateResponse | null,
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  // Validation du projectId
  if (!projectId || projectId.trim() === "") {
    errors.push({
      field: "projectId",
      message: "ID de projet requis",
      code: "MISSING_PROJECT_ID",
    });
  }

  // Validation du sessionId
  if (!sessionId || sessionId.trim() === "") {
    errors.push({
      field: "sessionId",
      message: "ID de session requis",
      code: "MISSING_SESSION_ID",
    });
  } else if (!sessionId.includes("-")) {
    warnings.push("Format de sessionId inhabituel");
  }

  // Validation du bouquet
  const bouquetValidation = validateBouquet(bouquet);
  errors.push(...bouquetValidation.errors);
  warnings.push(...bouquetValidation.warnings);

  // Validation des données Kelvin
  const kelvinValidation = validateKelvinData(initialState, projectedState);
  errors.push(...kelvinValidation.errors);
  warnings.push(...kelvinValidation.warnings);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Formatte les erreurs de validation en message lisible
 */
export function formatValidationErrors(validation: ValidationResult): string {
  if (validation.isValid) {
    return "";
  }

  const errorMessages = validation.errors.map(
    (error) => `${error.field}: ${error.message}`,
  );

  return `Erreurs de validation:\n${errorMessages.join("\n")}`;
}

/**
 * Log les warnings de validation
 */
export function logValidationWarnings(
  validation: ValidationResult,
  context: string = "",
): void {
  if (validation.warnings.length > 0) {
    console.warn(`⚠️ Warnings de validation ${context}:`, validation.warnings);
  }
}
