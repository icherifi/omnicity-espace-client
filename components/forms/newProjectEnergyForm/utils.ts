export const validateField = (field: string, value: string) => {
  switch (field) {
    case "firstName":
      return value.trim() === "" ? "Le prénom est requis" : "";
    case "lastName":
      return value.trim() === "" ? "Le nom est requis" : "";
    case "projectName":
      return value.trim() === "" ? "Le nom du projet est requis" : "";
    case "projectAddress":
      return value.trim() === "" ? "L'adresse est requise" : "";
    case "projectDescription":
      return value.trim() === "" ? "La description est requise" : "";
    case "fiscalIncome":
      return !/^\d+$/.test(value) ? "Revenus fiscaux invalides" : "";
    default:
      return "";
  }
};
