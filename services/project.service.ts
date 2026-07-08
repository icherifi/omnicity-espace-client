import {
  handleImageChange,
  handleNewProject,
  updateProjectImage,
  updateProject,
} from "@/utils/handleProjectDetails";
import { getToken } from "@/utils/supabase/client";
import { saveDpeFormToDb } from "@/utils/handleDpeData";
import { saveEnergyChoice } from "@/utils/handleEnergyChoiceData";
import {
  StandardProjectFormData,
  DpeProjectFormData,
} from "@/types/project.types";
import { EnergyMix } from "@/types/project.types";
import {
  mockEnergyResults,
  generateMockResultsByAddress,
  generateMockResultsByDpe,
} from "@/utils/mockData";

// Fonction utilitaire pour générer un UUID v4 valide
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export class ProjectService {
  static async getAuthToken(): Promise<string> {
    const token = await getToken();
    if (!token) {
      throw new Error("Vous n'êtes pas authentifié");
    }
    return token;
  }

  static async createStandardProject(
    data: StandardProjectFormData,
    options?: {
      idBouquet?: string | null;
      energyFormCompleted?: boolean;
      quizResults?: any;
      addressResults?: any;
      draft?: boolean;
    },
  ): Promise<string> {
    const token = await this.getAuthToken();

    const projectPayload: any = {
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.projectAddress,
      description: data.projectDescription,
      state: options?.draft ? "draft" : "inprogress",
      baseValue: data.baseValue,
    };

    const newProjectResponse = await handleNewProject(projectPayload, token);
    const projectId = newProjectResponse.data[0].id;

    // Sauvegarder les résultats énergétiques (mock data ou résultats d'adresse)
    if (
      options?.quizResults ||
      options?.addressResults ||
      options?.energyFormCompleted
    ) {
      const energyData =
        options.addressResults || options.quizResults || mockEnergyResults;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/${projectId}/energy`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              id: energyData.sessionId || "mock-session-" + Date.now(),
              id_project: projectId,
              energy_results: energyData,
            }),
          },
        );
        console.log("Energy data saved to backend", response);
      } catch (error) {
        console.error("Error saving energy data:", error);
      }
    }

    return projectId;
  }

  static async createProjectFromDpe(
    formData: DpeProjectFormData,
    selectedBouquet: EnergyMix,
    selectedStrategy: string,
  ): Promise<string> {
    const token = await this.getAuthToken();

    // Générer des mock data pour le DPE
    const mockDpeResults = generateMockResultsByDpe(
      formData.dpeInformation.dpeNumber,
    );

    const projectPayload: any = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.dpeInformation.address || "Adresse générée depuis DPE",
      state: "inprogress",
      description:
        formData.projectDescription || "Créé à partir du formulaire DPE",
      baseValue: formData.dpeInformation.baseValue,
    };

    const newProjectResponse = await handleNewProject(projectPayload, token);
    const projectId = newProjectResponse.data[0].id;

    // Sauvegarder les données DPE mock
    const mockDpeData = {
      dpeData: mockDpeResults.dpeData,
      energyResults: { ...mockEnergyResults, ...mockDpeResults },
    };

    await saveDpeFormToDb(mockDpeData, projectId, token);

    // Sauvegarder les résultats énergétiques mock
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/${projectId}/energy`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: generateUUID(),
            id_project: projectId,
            energy_results: mockDpeData.energyResults,
          }),
        },
      );
      console.log("DPE energy data saved to backend", response);
    } catch (error) {
      console.error("Error saving DPE energy data:", error);
    }

    await saveEnergyChoice(selectedStrategy, selectedBouquet);

    return projectId;
  }

  static async updateStandardProject(
    projectId: string,
    data: StandardProjectFormData,
    options?: {
      idBouquet?: string | null;
      energyFormCompleted?: boolean;
      quizResults?: any;
      addressResults?: any;
    },
  ) {
    const token = await this.getAuthToken();

    const projectPayload: any = {
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.projectAddress,
      description: data.projectDescription,
      // Si on complète le formulaire énergie, on passe le projet en cours
      state: options?.energyFormCompleted ? "inprogress" : undefined,
      baseValue: data.baseValue,
    };

    await updateProject(projectId, projectPayload);

    // Sauvegarder les résultats énergétiques (mock data ou résultats d'adresse)
    if (
      options?.quizResults ||
      options?.addressResults ||
      options?.energyFormCompleted
    ) {
      const energyData =
        options.addressResults || options.quizResults || mockEnergyResults;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/${projectId}/energy`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              id: energyData.sessionId || "mock-session-" + Date.now(),
              id_project: projectId,
              energy_results: energyData,
            }),
          },
        );
        console.log("Energy data saved to backend", response);
      } catch (error) {
        console.error("Error saving energy data:", error);
      }
    }

    return projectId;
  }

  static async updateProjectFromDpe(
    projectId: string,
    formData: DpeProjectFormData,
    selectedBouquet: EnergyMix,
    selectedStrategy: string,
  ) {
    const token = await this.getAuthToken();

    // Générer des mock data pour le DPE
    const mockDpeResults = generateMockResultsByDpe(
      formData.dpeInformation.dpeNumber,
    );

    const projectPayload: any = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.dpeInformation.address || "Adresse générée depuis DPE",
      state: "inprogress",
      description:
        formData.projectDescription || "Créé à partir du formulaire DPE",
      baseValue: formData.dpeInformation.baseValue,
    };

    await updateProject(projectId, projectPayload);

    // Sauvegarder les données DPE mock
    const mockDpeData = {
      dpeData: mockDpeResults.dpeData,
      energyResults: { ...mockEnergyResults, ...mockDpeResults },
    };

    await saveDpeFormToDb(mockDpeData, projectId, token);

    // Sauvegarder les résultats énergétiques mock
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/${projectId}/energy`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: generateUUID(),
            id_project: projectId,
            energy_results: mockDpeData.energyResults,
          }),
        },
      );
      console.log("DPE energy data saved to backend", response);
    } catch (error) {
      console.error("Error saving DPE energy data:", error);
    }

    await saveEnergyChoice(selectedStrategy, selectedBouquet);

    return projectId;
  }

  // Nouvelle méthode pour sauvegarder les résultats basés sur l'adresse
  static async saveAddressResults(
    projectId: string,
    address: string,
  ): Promise<string> {
    const token = await this.getAuthToken();

    // Générer des mock data basés sur l'adresse
    const addressResults = generateMockResultsByAddress(address);

    const energyData = {
      ...mockEnergyResults,
      ...addressResults,
      sessionId: "address-session-" + Date.now(),
      address: address,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/${projectId}/energy`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: energyData.sessionId,
            id_project: projectId,
            energy_results: energyData,
          }),
        },
      );
      console.log("Address-based energy data saved to backend", response);
    } catch (error) {
      console.error("Error saving address-based energy data:", error);
    }

    return projectId;
  }
}
