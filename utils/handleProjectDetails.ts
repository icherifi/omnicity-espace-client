export const deleteProject = async (projectId: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/${projectId}`,
      {
        method: "DELETE",
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
