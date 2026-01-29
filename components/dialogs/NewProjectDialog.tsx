"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import NewProjectEnergyForm from "../forms/newProjectEnergyForm/NewProjectEnergyForm";
import NewProjectCommonForm from "../forms/newProjectCommonForm/NewProjectCommonForm";
import NewProjectDpeNumberForm from "../forms/newProjectDpeNumberForm/NewProjectDpeNumberForm";
import AddressOnlyForm from "../forms/AddressOnlyForm";
import { useNewProjectStandardFormContext } from "@/contexts/newProjectStandardForm.context";
import { useEnergyFormContext } from "@/contexts/energyForm.context";
import { useSidebarContext } from "@/contexts/sidebar.context";
import { useProjectsContext } from "@/contexts/projects.context";
import { useDashboardContext } from "@/contexts/dashboard.context";
import Image from "next/image";
import { useProjectForm } from "@/hooks/useProjectForm";
import { ProjectService } from "@/services/project.service";
import { StandardProjectFormData } from "@/types/project.types";

interface NewProjectDialogProps {
  onProjectsPage?: boolean;
  children?: React.ReactNode;
  draftProjectId?: string;
}

function NewProjectDialog(props: NewProjectDialogProps) {
  const [hasDpe, setHasDpe] = useState<boolean | null>(null);
  const [commonCompleted, setCommonCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const {
    setIsEnergyFormDisplayed,
    setEnergyFormCompleted,
    setEnergyFormGotOpened,
    setPostalCode,
    setShowPostalCode,
    setIsEnergyLabelSolutionsDisplayed,
    isEnergyLabelSolutionsDisplayed,
    isEnergyFormDisplayed,
    energyFormCompleted,
  } = useEnergyFormContext();
  const { resetProjectStandardForm } = useNewProjectStandardFormContext();
  const { setSection } = useSidebarContext();
  const { projects, refreshProjects } = useProjectsContext();
  const { setCurrentProjectDisplayed } = useDashboardContext();
  const [draftProjectId, setDraftProjectId] = useState<string | null>(null);
  const { getStandardFormData } = useProjectForm("standard");
  const formCtx = useNewProjectStandardFormContext();

  const navigateToDashboardWithNewProject = () => {
    const projectId = localStorage.getItem("newProjectId");
    if (projectId) {
      refreshProjects();
      setTimeout(() => {
        const newProject = projects.find((p) => p.id === projectId);
        if (newProject) {
          setCurrentProjectDisplayed(newProject);
          setSection("dashboard");
        } else {
          refreshProjects();
          setTimeout(() => {
            const retryProject = projects.find((p) => p.id === projectId);
            if (retryProject) {
              setCurrentProjectDisplayed(retryProject);
              setSection("dashboard");
            }
          }, 100);
        }
        localStorage.removeItem("newProjectId");
      }, 200);
    }
  };

  // Si on ouvre pour continuer un brouillon
  useEffect(() => {
    if (props.draftProjectId) {
      setDraftProjectId(props.draftProjectId);
      localStorage.setItem("newProjectId", props.draftProjectId);
      setCommonCompleted(true);
      setHasDpe(null);

      // Pré-remplir les champs depuis le projet existant
      const proj = projects.find((p) => p.id === props.draftProjectId);
      if (proj) {
        const draftData: StandardProjectFormData = {
          firstName: proj.firstName,
          lastName: proj.lastName,
          projectName: "",
          projectAddress: proj.address,
          projectDescription: proj.description,
          generalInformation: {
            size: String(proj.features?.size ?? ""),
            roomsNumber: Number(proj.features?.roomsNumber ?? 0),
            floorsNumber: Number(proj.features?.floorsNumber ?? 0),
          },
          contractType: proj.contract_type,
          fiscalIncome: proj.features?.fiscalIncome ?? "",
          householdSize: proj.features?.householdSize ?? "",
          baseValue: proj.features?.baseValue ?? "",
          occupancyStatus: "primaryOwner",
          image: null,
        };

        // Appliquer les valeurs au context via setters
        formCtx.setFirstName(draftData.firstName || "");
        formCtx.setLastName(draftData.lastName || "");
        formCtx.setProjectAddress(draftData.projectAddress || "");
        formCtx.setProjectDescription(draftData.projectDescription || "");
        formCtx.setContractType(draftData.contractType || "");
        formCtx.setProjectGeneralInformation(draftData.generalInformation);
        formCtx.setFiscalIncome(draftData.fiscalIncome || "");
        formCtx.setHouseholdSize(draftData.householdSize || "");
        formCtx.setBaseValue(draftData.baseValue || "");
        formCtx.setOccupancyStatus(draftData.occupancyStatus || "primaryOwner");
      }
    }
  }, [props.draftProjectId]);

  const handleClose = () => {
    setOpen(false);
    setHasDpe(null);
    setCommonCompleted(false);
    resetProjectStandardForm();
    setIsEnergyFormDisplayed(false);
    setEnergyFormCompleted(false);
    setEnergyFormGotOpened(false);
    setIsEnergyLabelSolutionsDisplayed(false);
    setPostalCode("");
    setShowPostalCode(true);
    setError(null);
    setCreationSuccess(false);

    // Rafraîchir la liste des projets quand l'utilisateur quitte le dialog
    refreshProjects();

    // Si un nouveau projet a été créé avec succès, naviguer vers le dashboard
    if (creationSuccess) {
      navigateToDashboardWithNewProject();
    }
  };

  const handleBackToCommonForm = () => {
    setHasDpe(null);
    setCommonCompleted(false);
    setIsEnergyFormDisplayed(false);
    setEnergyFormCompleted(false);
    setEnergyFormGotOpened(false);
    setIsEnergyLabelSolutionsDisplayed(false);
    setPostalCode("");
    setShowPostalCode(true);
    setError(null);
    setCreationSuccess(false);
  };

  const handleSuccess = () => {
    setCreationSuccess(true);
  };

  const getCurrentStep = () => {
    if (!commonCompleted) return 0;
    if (hasDpe === null) return 1;
    if (isEnergyFormDisplayed) {
      if (energyFormCompleted) return 3;
      return 2;
    }
    return 2;
  };

  const getTotalSteps = () => {
    if (!commonCompleted) return 0;
    if (hasDpe === null) return 1;
    if (hasDpe) {
      if (energyFormCompleted) return 3;
      return 2;
    }
    return 2;
  };

  const getDialogTitle = () => {
    if (isEnergyLabelSolutionsDisplayed) return "Choisir le plan";
    if (!commonCompleted) return "Création d'un nouveau projet";
    if (hasDpe === null) return "Diagnostic de Performance Énergétique";
    if (hasDpe === false) return "Estimation par adresse";
    if (hasDpe === true) return "Analyse DPE";
    if (isEnergyFormDisplayed) {
      if (energyFormCompleted) return "Création du projet";
      return "Formulaire énergétique";
    }
    return "Nouveau projet";
  };

  const getDialogDescription = () => {
    if (isEnergyLabelSolutionsDisplayed)
      return "Des options pour optimiser votre classification énergétique";
    if (!commonCompleted)
      return "Complétez ce formulaire pour démarrer votre projet.";
    if (hasDpe === null)
      return "Avez-vous un Diagnostic de Performance Énergétique (DPE) pour votre logement ?";
    if (hasDpe === false)
      return "Notre technologie permet d'estimer la performance énergétique simplement avec l'adresse.";
    if (hasDpe === true)
      return "Saisissez votre numéro DPE pour récupérer automatiquement les informations de votre logement.";
    if (isEnergyFormDisplayed) {
      if (energyFormCompleted) return "Votre projet est prêt à être créé.";
      return "Complétez ce formulaire pour gérer la partie électrique de votre projet.";
    }
    return "C'est ici que tout commence, complétez le formulaire, on s'occupe du reste.";
  };

  const handleCommonNext = async () => {
    try {
      const standardData = getStandardFormData();
      // Créer un projet brouillon uniquement si ce n'est pas déjà fait
      if (!draftProjectId) {
        const projectId = await ProjectService.createStandardProject(
          standardData,
          { draft: true },
        );
        setDraftProjectId(projectId);
        // Stocker en localStorage pour d'éventuelles reprises après rafraîchissement
        localStorage.setItem("newProjectId", projectId);
      }
      setCommonCompleted(true);
    } catch (e: any) {
      console.error("Erreur lors de la création du projet", e);
      setError(
        e.message || "Une erreur est survenue lors de la création du projet",
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        } else {
          setOpen(true);
        }
      }}
    >
      <DialogTrigger asChild>
        {props.children ? (
          props.children
        ) : props.onProjectsPage ? (
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Nouveau projet
          </span>
        ) : (
          <Button>Nouveau projet</Button>
        )}
      </DialogTrigger>

      <DialogContent
        className={`${isEnergyLabelSolutionsDisplayed ? "sm:max-w-fit" : "sm:max-w-[750px]"} max-h-[85vh] overflow-y-auto`}
      >
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>

        {hasDpe !== null && !creationSuccess && !error && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-300"
              style={{
                width: `${(getCurrentStep() / getTotalSteps()) * 100}%`,
              }}
            ></div>
          </div>
        )}

        {creationSuccess ? (
          <div className="min-h-0 bg-background text-foreground flex flex-col">
            <header className="bg-white dark:bg-gray-900 shadow-sm border-b p-4 flex items-center">
              <div className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="omnicity logo"
                  width={32}
                  height={32}
                />
              </div>
              <h1 className="text-primary ml-6 font-bold text-lg hidden md:block">
                Améliorer la performance énergétique de mon logement
              </h1>
            </header>

            <div className="flex flex-1">
              <main className="flex-1 p-6">
                <div className="max-w-3xl mx-auto flex flex-col items-center">
                  <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white text-center">
                    Formulaire envoyé avec succès
                  </h1>
                  <p className="text-center text-[18px] w-10/12 text-gray-600 dark:text-gray-300 text-sm mb-4">
                    Votre formulaire a bien été reçu et traité, les données sont
                    désormais disponibles dans le tableau de bord.
                  </p>
                  <Button
                    onClick={() => {
                      navigateToDashboardWithNewProject();
                      handleClose();
                    }}
                    className="bg-primary h-[48px] rounded-[12px] hover:bg-primary/90 w-1/2 mt-4"
                  >
                    Continuer
                  </Button>
                  <div className="self-end absolute bottom-0 right-0">
                    <Image
                      src="/successform.png"
                      alt="success"
                      width={200}
                      height={300}
                    />
                  </div>
                </div>
              </main>
            </div>
          </div>
        ) : error ? (
          <div className="min-h-0 bg-background text-foreground flex flex-col">
            <header className="bg-white dark:bg-gray-900 shadow-sm border-b p-4 flex items-center">
              <div className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="omnicity logo"
                  width={32}
                  height={32}
                />
              </div>
              <h1 className="text-primary ml-6 font-bold text-lg hidden md:block">
                Améliorer la performance énergétique de mon logement
              </h1>
            </header>

            <div className="flex flex-1">
              <main className="flex-1 p-6">
                <div className="max-w-3xl mx-auto flex flex-col items-center">
                  <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white text-center">
                    Oups, une erreur s'est produite..
                  </h1>
                  <p className="text-center text-[18px] w-10/12 text-gray-600 dark:text-gray-300 text-sm mb-4">
                    Nous sommes désolés, mais votre formulaire n'a pas pu être
                    envoyé. Un problème est survenu lors du traitement de votre
                    demande.
                  </p>
                  <Button
                    onClick={() => handleClose()}
                    className="bg-primary h-[48px] rounded-[12px] hover:bg-primary/90 w-1/2 mt-4"
                  >
                    Continuer
                  </Button>
                  <div className="self-end absolute bottom-0 right-0">
                    <Image
                      src="/failform.png"
                      alt="success"
                      width={170}
                      height={250}
                    />
                  </div>
                </div>
              </main>
            </div>
          </div>
        ) : !commonCompleted ? (
          <NewProjectCommonForm onNext={handleCommonNext} />
        ) : hasDpe === null ? (
          <div className="flex flex-col sm:flex-row gap-6 py-4 justify-center items-stretch">
            <div
              className="flex flex-col justify-between h-full bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 flex-1 cursor-pointer border-2 border-transparent hover:border-primary transition"
              onClick={() => setHasDpe(true)}
            >
              <div>
                <div className="font-bold text-xl text-center mb-1 text-gray-900 dark:text-white">
                  J'ai un numéro DPE
                </div>
                <div className="text-center text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Rapide : Moins d'une minute !
                </div>
              </div>
              <div className="flex justify-center my-4">
                <Image
                  src="/dpetruesvg.svg"
                  alt="J'ai un numéro DPE"
                  width={354}
                  height={436}
                  className="mb-4"
                />
              </div>
              <Button className="bg-primary hover:bg-primary/90 w-full mt-4">
                Accéder au formulaire
              </Button>
            </div>
            <div
              className="flex flex-col justify-between h-full bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 flex-1 cursor-pointer border-2 border-transparent hover:border-primary transition"
              onClick={() => setHasDpe(false)}
            >
              <div>
                <div className="font-bold text-xl text-center mb-1 text-gray-900 dark:text-white">
                  Je n'ai pas de numéro DPE
                </div>
                <div className="text-center text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Estimation par adresse : Rapide et simple !
                </div>
              </div>
              <div className="flex justify-center my-4">
                <Image
                  src="/dpefalsesvg.svg"
                  alt="Je n'ai pas de numéro DPE"
                  width={354}
                  height={436}
                  className="mb-4"
                />
              </div>
              <Button className="bg-primary hover:bg-primary/90 w-full mt-4">
                Accéder au formulaire
              </Button>
            </div>
          </div>
        ) : (
          <>
            {hasDpe ? (
              <NewProjectDpeNumberForm
                onError={(error) => setError(error)}
                onSuccess={handleSuccess}
                onQuit={handleBackToCommonForm}
              />
            ) : (
              <AddressOnlyForm
                onError={(error) => setError(error)}
                onSuccess={handleSuccess}
                onQuit={handleBackToCommonForm}
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default NewProjectDialog;
