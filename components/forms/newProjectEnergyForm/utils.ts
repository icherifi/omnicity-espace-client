export const validateField = (field: string, value: string) => {
    switch (field) {
      case 'firstName':
        return value.trim() === '' ? 'Le prénom est requis' : '';
      case 'lastName':
        return value.trim() === '' ? 'Le nom est requis' : '';
      case 'projectName':
        return value.trim() === '' ? 'Le nom du projet est requis' : '';
      case 'projectAddress':
        return value.trim() === '' ? 'L\'adresse est requise' : '';
      case 'projectDescription':
        return value.trim() === '' ? 'La description est requise' : '';
      case 'contractType':
        return value.trim() === '' ? 'Le type de contrat est requis' : '';
      case 'size':
        return !value || isNaN(Number(value)) || Number(value) <= 0 
          ? 'La taille doit être un nombre positif' 
          : '';
      case 'roomsNumber':
        return !value || isNaN(Number(value)) || Number(value) <= 0 
          ? 'Le nombre de pièces doit être un nombre positif' 
          : '';
      case 'floorsNumber':
        return !value || isNaN(Number(value)) || Number(value) < 0
          ? 'Le nombre d\'étages doit être un nombre positif ou nul'
          : '';
      case 'fiscalIncome':
        return !/^\d+$/.test(value) ? 'Revenus fiscaux invalides' : '';
      case 'householdSize':
        return !/^\d+$/.test(value) ? 'Nombre de personnes invalide' : '';
      case 'baseValue':
        return !/^\d+(\.\d+)?$/.test(value) ? 'Valeur du bien invalide' : '';
      case 'occupancyStatus':
        return value.trim() === '' ? 'Statut requis' : '';
      default:
        return '';
    }
};