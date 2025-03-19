import { Dispatch, SetStateAction } from "react";
import { getToken } from "./supabase/client";
import { ProjectType } from "@/contexts/projects.context";

export const deleteProject = async (
  projectId: string,
  token: string
): Promise<boolean> => {
  console.log("token", token);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/${projectId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete project");
    }
    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    return false;
  }
};

export const getScans = async (projectId: string): Promise<any[] | null> => {
  const token = await getToken();
  if (!token) {
    console.error("You are not authenticated");
    return null;
  }
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/${projectId}/scans`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.length > 0 ? data : null;
  } catch (error) {
    console.error("Error fetching project scans:", error);
    return null;
  }
};

export const handleImageChange = async (
  file: File,
  token: string,
  projectId: number
): Promise<string | null> => {
  try {
    if (!file) return null;

    const formData = new FormData();
    formData.append("image", file);
    const imageId = Math.random().toString(36).substring(2, 15);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/${projectId}/images/${imageId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data?.fullPath;

    console.log("Image uploaded successfully:", imageUrl);
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

export const updateProjectImage = async (
  projectId: number,
  imageFullPath: string,
  token: string
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/${projectId}/imageFullPath`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageFullPath: imageFullPath }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("Project image updated successfully");
  } catch (error) {
    console.error("Error updating project image:", error);
  }
};

export const handleNewProject = async (
  projectData: any,
  token: string
): Promise<{ message: string; data: { id: number }[] }> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify([projectData]),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Project created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export async function saveIziResponseToBackend(
  iziResponse: any,
  projectId: number,
  token: string
) {
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
          id: iziResponse.sessionId,
          id_project: projectId,
          izi_response: iziResponse,
        }),
      }
    );
    console.log("Response from back-end after form save", response);
  } catch (error) {
    console.error("Error saving IZI response to backend:", error);
    throw error;
  }
}

export const handleProjectDetail = async (
  setProjects: Dispatch<SetStateAction<ProjectType[]>>
) => {
  const token = await getToken();
  if (!token) {
    console.error("You are not authenticated");
    return;
  }
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const projectsWithEnergyDetails = await Promise.all(
      data.map(async (project: any) => {
        const energyDetails = await getProjectEnergyDetails(project.id);
        return {
          ...project,
          stateOfPlay: project.description,
          costEstimation: energyDetails[0]
            ? {
                withAid: energyDetails[0].izi_response.bouquets[1].resteACharge,
                withoutAid: energyDetails[0].izi_response.bouquets[1].coutTotal,
              }
            : undefined,
          targetedEnergyRating: energyDetails[0]
            ? energyDetails[0].izi_response.bouquets[1].etiquette
            : undefined,
          actualEnergyRating: energyDetails[0]
            ? energyDetails[0].izi_response.etiquetteInitial
            : undefined,
          iziResponse: energyDetails[0]?.izi_response,
        };
      })
    );
    console.log("Projects with energy details", projectsWithEnergyDetails);
    setProjects(projectsWithEnergyDetails);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
  }
};

export const getProjectEnergyDetails = async (projectId: string) => {
  const token = await getToken();
  if (!token) {
    console.error("You are not authenticated");
    return null;
  }
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/${projectId}/energy`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching project energy details:", error);
    return null;
  }
};
