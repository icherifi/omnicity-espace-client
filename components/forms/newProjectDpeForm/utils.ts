export const isFormValid = (newProjectDpeFormData: {
  dpeNumber: string;
  fiscalIncome: string;
  householdSize: string;
  occupancyStatus: string;
}) => {
  return (
    newProjectDpeFormData.dpeNumber.trim() !== "" &&
    /^[A-Z0-9]{14}$/.test(newProjectDpeFormData.dpeNumber) &&
    newProjectDpeFormData.fiscalIncome.trim() !== "" &&
    newProjectDpeFormData.householdSize.trim() !== "" &&
    newProjectDpeFormData.occupancyStatus.trim() !== "" &&
    /^\d+$/.test(newProjectDpeFormData.fiscalIncome) &&
    /^\d+$/.test(newProjectDpeFormData.householdSize)
    );
  };