export const validateField = (field: string, value: string) => {
    switch (field) {
      case 'authorName':
        return value.trim() === '' ? 'Le nom de l\'auteur est requis' : '';
      case 'projectName':
        return value.trim() === '' ? 'Le nom du projet est requis' : '';
      case 'projectAddress':
        return value.trim() === '' ? 'L\'adresse est requise' : '';
      case 'projectDescription':
        return value.trim() === '' ? 'La description est requise' : '';
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
      default:
        return '';
    }
};