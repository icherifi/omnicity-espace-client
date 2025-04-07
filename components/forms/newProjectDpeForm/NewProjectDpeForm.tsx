"use client";

import React, { useState } from "react";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { useNewProjectStandardFormContext } from "@/contexts/newProjectStandardForm.context";
import { fetchDpeData } from "@/utils/handleDpeData";

interface DpeFormData {
  dpeNumber: string;
  fiscalIncome: string;
  householdSize: string;
  postalCode: string;
}

interface NewProjectDpeFormProps {
  onError?: (error: string) => void;
}

function NewProjectDpeForm({ onError }: NewProjectDpeFormProps) {
  const [formData, setFormData] = useState<DpeFormData>({
    dpeNumber: "",
    fiscalIncome: "",
    householdSize: "",
    postalCode: "",
  });

  const { projectName, setProjectName } = useNewProjectStandardFormContext();
  const { projectAddress, setProjectAddress } = useNewProjectStandardFormContext();

  const isFormValid = () => {
    return (
      projectName.trim() !== "" &&
      projectAddress.trim() !== "" &&
      /^[A-Z0-9]{14}$/.test(formData.dpeNumber) &&
      formData.fiscalIncome.trim() !== "" &&
      formData.householdSize.trim() !== "" &&
      formData.postalCode.trim() !== "" &&
      /^\d{5}$/.test(formData.postalCode) &&
      /^\d+$/.test(formData.fiscalIncome) &&
      /^\d+$/.test(formData.householdSize)
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const dpeData = await fetchDpeData(formData.dpeNumber);
      console.log(dpeData);
      
      /*if (!dpeData || dpeData.length === 0) {
        throw new Error("Aucune donnée DPE trouvée.");
      }
  
      const missingQuestions = await fetchOpenAIMissingQuestions(dpeData);
      console.log("Questions restantes:", missingQuestions);
  
      // Étape 3 : Création de la session pour le quiz
      const session = await createSession();
      if (!session || !session.id) {
        throw new Error("Échec de la création de session.");
      }
      console.log("Session créée:", session.id);
  
      let sessionId = session.id;
      let steps = [session.currentStep];
  
      // Étape 4 : Boucle pour répondre aux questions restantes
      for (const question of missingQuestions) {
        console.log("Répondre à la question:", question);
  
        // Simuler la réponse (en fonction de la logique métier)
        const answer = simulateAnswer(question);
  
        const response = await sendStepAnswer(question.id, answer);
  
        if (response.nextStep) {
          steps.push(response.nextStep);
        }
      }
  
      // Étape 5 : Récupération du résumé du quiz
      const quizSummary = await getQuizSummary(sessionId);
      console.log("Résumé du quiz:", quizSummary);
  
      if (!quizSummary) {
        throw new Error("Résumé du quiz introuvable.");
      }
  
      // Étape 6 : Récupération des résultats finaux du quiz
      const quizResults = await handleQuizResults({ ...quizSummary, "Code Postal": formData.postalCode });
      console.log("Résultats du quiz:", quizResults);
  
      // Stockage des résultats (localStorage ou autre)
      if (typeof window !== "undefined") {
        localStorage.setItem("quizResults", JSON.stringify(quizResults));
        localStorage.setItem("quizSteps", JSON.stringify(steps));
      }
  
      console.log(quizResults);*/
    } catch (error) {
      console.error("Erreur dans handleSubmit:", error);
      onError?.("Une erreur est survenue lors de la création du projet.");
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Nouveau projet avec DPE</DialogTitle>
        <DialogDescription>
          Veuillez renseigner les informations de votre DPE et votre situation
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="projectName" className="text-right">
            Nom du projet
          </Label>
          <Input
            id="projectName"
            value={projectName}
            className="col-span-3"
            onChange={(e) => setProjectName(e.currentTarget.value)}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="projectAddress" className="text-right">
            Adresse du bien
          </Label>
          <Input
            id="projectAddress"
            value={projectAddress}
            className="col-span-3"
            placeholder="237 Rue des Pyrénées, 75020"
            onChange={(e) => setProjectAddress(e.currentTarget.value)}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="dpeNumber" className="text-right">
            Numéro DPE
          </Label>
          <Input
            id="dpeNumber"
            value={formData.dpeNumber}
            className="col-span-3"
            placeholder="2324D1234567"
            onChange={handleInputChange}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="fiscalIncome" className="text-right">
            Revenus fiscaux
          </Label>
          <Input
            id="fiscalIncome"
            type="number"
            value={formData.fiscalIncome}
            className="col-span-3"
            placeholder="30000"
            onChange={handleInputChange}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="householdSize" className="text-right">
            Nombre de personnes
          </Label>
          <Input
            id="householdSize"
            type="number"
            value={formData.householdSize}
            className="col-span-3"
            placeholder="2"
            onChange={handleInputChange}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="postalCode" className="text-right">
            Code postal
          </Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            className="col-span-3"
            placeholder="75020"
            maxLength={5}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button onClick={handleSubmit} disabled={!isFormValid()}>
            Créer le projet
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
}

export default NewProjectDpeForm;
