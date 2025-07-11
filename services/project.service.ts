import { handleImageChange, handleNewProject, saveIziResponseToBackend, updateProjectImage, updateProject } from "@/utils/handleProjectDetails";
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
      draft?: boolean;
    }
  ): Promise<string> {
    const token = await this.getAuthToken();

    const projectPayload: any = {
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.projectAddress,
      description: data.projectDescription,
      state: options?.draft ? "draft" : "inprogress",
      id_bouquet: options?.idBouquet ?? null,
      features: {
        ...data.generalInformation,
        baseValue: data.baseValue,
        fiscalIncome: data.fiscalIncome,
        householdSize: data.householdSize,
        occupancyStatus: data.occupancyStatus,
      },
      contract_type: data.contractType,
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
  ): Promise<string> {
    const token = await this.getAuthToken();

    const projectPayload: any = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: dpeData.dpeData.adresse,
      state: "inprogress",
      id_bouquet: sessionId || null,
      description: formData.projectDescription || "Créé à partir du formulaire DPE",
      contract_type: formData.contract_type,
      features: {
        size: dpeData.dpeData.caracteristiques.taille,
        roomsNumber: 0,
        floorsNumber: dpeData.dpeData.caracteristiques.nombreEtages,
        baseValue: formData.dpeInformation.baseValue,
        fiscalIncome: formData.dpeInformation.fiscalIncome,
        householdSize: formData.dpeInformation.householdSize,
        occupancyStatus: formData.dpeInformation.occupancyStatus,
        numeroDpe: dpeData.dpeData.numero_dpe || null,
      },
    };

    const newProjectResponse = await handleNewProject(projectPayload, token);
    const projectId = newProjectResponse.data[0].id;

    await saveDpeFormToDb(dpeData, projectId, token);
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

  static async updateStandardProject(
    projectId: string,
    data: StandardProjectFormData,
    options?: {
      idBouquet?: string | null;
      energyFormCompleted?: boolean;
      quizResults?: IziResponse | Record<string, unknown>;
    }
  ) {
    const token = await this.getAuthToken();

    const projectPayload: any = {
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.projectAddress,
      description: data.projectDescription,
      id_bouquet: options?.idBouquet ?? undefined,
      // Si on complète le formulaire énergie, on passe le projet en cours
      state: options?.energyFormCompleted ? "inprogress" : undefined,
      features: {
        ...data.generalInformation,
        baseValue: data.baseValue,
        fiscalIncome: data.fiscalIncome,
        householdSize: data.householdSize,
        occupancyStatus: data.occupancyStatus,
      },
      contract_type: data.contractType,
    };

    await updateProject(projectId, projectPayload, token);

    // Handle image update if provided
    if (data.image) {
      const imageFullPath = await handleImageChange(data.image, token, projectId);
      if (imageFullPath) {
        await updateProjectImage(projectId, imageFullPath, token);
      }
    }

    // Save energy results if available
    if (options?.energyFormCompleted && options.quizResults) {
      await saveIziResponseToBackend(options.quizResults, projectId, token);
    }

    return projectId;
  }

  static async updateProjectFromDpe(
    projectId: string,
    formData: DpeProjectFormData,
    dpeData: any,
    sessionId: string,
    selectedBouquet: EnergyMix,
    selectedStrategy: string
  ) {
    const token = await this.getAuthToken();

    const projectPayload: any = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: dpeData.dpeData.adresse,
      state: "inprogress",
      id_bouquet: sessionId || undefined,
      description: formData.projectDescription || "Créé à partir du formulaire DPE",
      contract_type: formData.contract_type,
      features: {
        size: dpeData.dpeData.caracteristiques.taille,
        roomsNumber: 0,
        floorsNumber: dpeData.dpeData.caracteristiques.nombreEtages,
        baseValue: formData.dpeInformation.baseValue,
        fiscalIncome: formData.dpeInformation.fiscalIncome,
        householdSize: formData.dpeInformation.householdSize,
        occupancyStatus: formData.dpeInformation.occupancyStatus,
        numeroDpe: dpeData.dpeData.numero_dpe || null,
      },
    };

    await updateProject(projectId, projectPayload, token);

    await saveDpeFormToDb(dpeData, projectId, token);
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