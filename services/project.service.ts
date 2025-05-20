import { handleImageChange, handleNewProject, saveIziResponseToBackend, updateProjectImage } from "@/utils/handleProjectDetails";
import { getToken } from "@/utils/supabase/client";
import { saveDpeFormToDb } from "@/utils/handleDpeData";
import { saveEnergyChoice } from "@/utils/handleEnergyChoiceData";
import { StandardProjectFormData, DpeProjectFormData } from "@/types/project.types";
import { EnergyMix, IziResponse } from "@/types/project.types";

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
      quizResults?: IziResponse | Record<string, unknown>;
    }
  ) {
    const token = await this.getAuthToken();

    const projectPayload: any = {
      authorName: data.authorName,
      name: data.projectName,
      address: data.projectAddress,
      description: data.projectDescription,
      state: "inprogress",
      id_bouquet: options?.idBouquet ?? null,
      features: data.generalInformation,
    };

    const newProjectResponse = await handleNewProject(projectPayload, token);
    const projectId = newProjectResponse.data[0].id;

    if (data.image) {
      const imageFullPath = await handleImageChange(data.image, token, projectId);
      if (imageFullPath) {
        await updateProjectImage(projectId, imageFullPath, token);
      }
    }

    if (options?.energyFormCompleted && options.quizResults) {
      await saveIziResponseToBackend(options.quizResults, projectId, token);
    }

    return projectId;
  }

  static async createProjectFromDpe(
    formData: DpeProjectFormData,
    dpeData: any,
    sessionId: string,
    selectedBouquet: EnergyMix,
    selectedStrategy: string
  ) {
    const token = await this.getAuthToken();

    const projectPayload: any = {
      authorName: formData.authorName,
      name: formData.projectName,
      address: dpeData.dpeData.adresse,
      state: "inprogress",
      id_bouquet: sessionId || null,
      description: "Créé à partir du formulaire DPE",
      features: {
        size: dpeData.dpeData.caracteristiques.taille,
        roomsNumber: 0,
        floorsNumber: dpeData.dpeData.caracteristiques.nombreEtages,
        baseValue: dpeData.dpeData.caracteristiques.valeurBase,
      },
    };

    const newProjectResponse = await handleNewProject(projectPayload, token);
    const projectId = newProjectResponse.data[0].id;

    await saveDpeFormToDb(dpeData, projectId.toString(), token);
    await saveIziResponseToBackend(dpeData.iziResponse, projectId, token);
    await saveEnergyChoice(sessionId, selectedStrategy, selectedBouquet);

    if (formData.image) {
      const imageFullPath = await handleImageChange(formData.image, token, projectId);
      if (imageFullPath) {
        await updateProjectImage(projectId, imageFullPath, token);
      }
    }

    return projectId;
  }
} 