"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import NewProjectStandardForm from "../forms/NewProjectStandardForm";
import NewProjectDpeForm from "../forms/newProjectDpeForm/NewProjectDpeForm";
import { useNewProjectStandardFormContext } from "@/contexts/newProjectStandardForm.context";
import { useEnergyFormContext } from "@/contexts/energyForm.context";

function NewProjectDialog(props: { onProjectsPage?: boolean }) {
  const [hasDpe, setHasDpe] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    setIsEnergyFormDisplayed,
    setEnergyFormCompleted,
    setEnergyFormGotOpened,
    isEnergyLabelSolutionsDisplayed,
    isEnergyFormDisplayed,
    energyFormCompleted,
  } = useEnergyFormContext();
  const { resetProjectStandardForm } = useNewProjectStandardFormContext();

  const getCurrentStep = () => {
    if (hasDpe === null) return 0;
    if (isEnergyFormDisplayed) {
      if (energyFormCompleted) return 3;
      return 2;
    }
    return 1;
  };

  const getTotalSteps = () => {
    if (hasDpe === null) return 0;
    if (hasDpe) {
      if (energyFormCompleted) return 3;
      return 2;
    }
    return 2;
  };

  const getDialogTitle = () => {
    if (hasDpe === null) return "Création d'un nouveau projet";
    if (isEnergyFormDisplayed) {
      if (energyFormCompleted) return "Création du projet";
      return "Formulaire énergétique";
    }
    return "Nouveau projet";
  };

  const getDialogDescription = () => {
    if (hasDpe === null)
      return "Avez-vous un Diagnostic de Performance Énergétique (DPE) pour votre logement ?";
    if (isEnergyFormDisplayed) {
      if (energyFormCompleted) return "Votre projet est prêt à être créé.";
      return "Complétez ce formulaire pour gérer la partie électrique de votre projet.";
    }
    return "C'est ici que tout commence, complétez le formulaire, on s'occupe du reste.";
  };

  return (
    <Dialog
      onOpenChange={() => {
        setHasDpe(null);
        resetProjectStandardForm();
        setIsEnergyFormDisplayed(false);
        setEnergyFormCompleted(false);
        setEnergyFormGotOpened(false);
        setError(null);
      }}
    >
      <DialogTrigger asChild>
        {props.onProjectsPage ? (
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Nouveau projet
          </span>
        ) : (
          <Button>Nouveau projet</Button>
        )}
      </DialogTrigger>

      <DialogContent
        className={`${
          isEnergyLabelSolutionsDisplayed ? "sm:max-w-fit" : "sm:max-w-[750px]"
        } max-h-[85vh] overflow-y-auto`}
      >
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>

        {hasDpe !== null && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-300"
              style={{
                width: `${(getCurrentStep() / getTotalSteps()) * 100}%`,
              }}
            ></div>
          </div>
        )}

        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {hasDpe === null ? (
          <div className="flex justify-center space-x-4 py-4">
            <Button
              onClick={() => setHasDpe(true)}
              className="bg-primary hover:bg-primary/90"
            >
              Oui, j'ai un DPE
            </Button>
            <div className="relative group">
              <Button
                onClick={() => setHasDpe(false)}
                variant="secondary"
                disabled
                className="hover:cursor-not-allowed"
              >
                Non, je n'ai pas de DPE
              </Button>
              <div className="absolute bottom-full left transform mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                Bientôt disponible
              </div>
            </div>
          </div>
        ) : (
          <>
            {hasDpe ? (
              <NewProjectDpeForm onError={(error) => setError(error)} />
            ) : (
              <NewProjectStandardForm onError={(error) => setError(error)} />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default NewProjectDialog;
