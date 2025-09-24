"use client";

import React, { useEffect, useState } from "react";
import { createSession, sendStepAnswer, getQuizSummary, handleQuizResults } from "@/utils/handleEnergyFormData";
import { useEnergyFormContext } from "@/contexts/energyForm.context";
import { CheckCircle, X, Zap, Flame, Droplet, ChevronDown } from 'lucide-react';
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProjectForm } from "@/hooks/useProjectForm";

import RectangularCompact from "../svgs/house-shapes/RectangularCompact";
import RectangularLong from "../svgs/house-shapes/RectangularLong";
import LShape from "../svgs/house-shapes/LShape";
import UShape from "../svgs/house-shapes/UShape";

import NonMitoyen from "../svgs/mitoyennete/NonMitoyen";
import UneFacade from "../svgs/mitoyennete/UneFacade";
import DeuxFacades from "../svgs/mitoyennete/DeuxFacades";
import TroisFacades from "../svgs/mitoyennete/TroisFacades";

import ComblesPerdus from "../svgs/toiture/ComblesPerdus";
import ComblesAmenages from "../svgs/toiture/ComblesAmenages";
import ToitTerrasse from "../svgs/toiture/ToitTerrasse";

import TerrePlein from "../svgs/plancher/TerrePlein";
import Cave from "../svgs/plancher/Cave";
import VideSanitaire from "../svgs/plancher/VideSanitaire";

const isIleDeFrance = (cp: string): string =>
  /^(75|77|78|91|92|93|94|95)/.test(cp) ? "En Ile de France" : "Hors Ile de France";

function mapOccupancyStatusToLabel(status: string): string {
  switch (status) {
    case "primaryOwner":
      return "Propriétaire résidence principale";
    case "secondaryOwner":
      return "Propriétaire résidence secondaire";
    case "ownerTenant":
      return "Propriétaire bailleur";
    case "tenant":
      return "Locataire";
    default:
      return "";
  }
}

function mapFiscalIncomeToInterval(
  income: string,
  choices: { id: string; label: string; position?: number }[] = []
): string {
  if (!choices.length) return income;
  const numeric = parseFloat(income);
  if (isNaN(numeric)) return choices[0]?.label ?? "";
  const sorted = [...choices].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0)
  );
  for (const c of sorted) {
    const nums = c.label.match(/\d+/g)?.map(Number) ?? [];
    if (c.label.startsWith("<") && numeric < nums[0]) return c.label;
    if (c.label.startsWith(">") && numeric > nums[0]) return c.label;
    if (nums.length === 2 && numeric >= nums[0] && numeric <= nums[1])
      return c.label;
  }
  return sorted[sorted.length - 1].label;
}

const WoodIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 12C4 9.79086 5.79086 8 8 8H16C18.2091 8 20 9.79086 20 12C20 14.2091 18.2091 16 16 16H8C5.79086 16 4 14.2091 4 12Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 10C8 10 10 12 12 12C14 12 16 10 16 10" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 14C8 14 10 12 12 12C14 12 16 14 16 14" stroke="currentColor" strokeWidth="2"/>
    <path d="M4 11L4 13M20 11L20 13" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const questionIcons: { [key: string]: { [key: string]: React.FC } } = {
  "Sa forme :": {
    "Rectangulaire compacte": RectangularCompact,
    "Rectangulaire allongée": RectangularLong,
    "En L ou en T compacte": LShape,
    "En L ou en T allongée": LShape,
    "En U": UShape
  },
  "La maison est-elle mitoyenne ?": {
    "Non": NonMitoyen,
    "Oui, sur 1 façade": UneFacade,
    "Oui, sur 2 façades": DeuxFacades,
    "Oui, sur 3 façades": TroisFacades
  },
  "Le type de toiture :": {
    "Combles perdus": ComblesPerdus,
    "Combles aménagés": ComblesAmenages,
    "Toit terrasse": ToitTerrasse
  },
  "Quel est votre type de planchers bas ?": {
    "Terre plein": TerrePlein,
    "Cave ou sous-sol": Cave,
    "Vide sanitaire": VideSanitaire
  },
  "Quelle est la source d'énergie de chauffage principale ?": {
    "Electricité": Zap,
    "Bois": WoodIcon,
    "Gaz ou propane": Flame,
    "Fioul": Droplet,
    "Charbon": () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/>
        <path d="M12 8v10m-4-7l8 4"/>
      </svg>
    )
  }
};

export default function EnergyForm({ onQuit }: { onQuit?: () => void }) {
  const [loading, setLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [error, setError] = useState<string>();
  const {
    sessionId,
    setSessionId,
    setIsEnergyFormDisplayed,
    setEnergyFormCompleted,
    setEnergyFormGotOpened,
    setIsEnergyLabelSolutionsDisplayed,
    postalCode,
    setPostalCode,
    showPostalCode,
    setShowPostalCode,
    steps,
    setSteps,
    activeStepIndex,
    setActiveStepIndex,
    answerState,
    setAnswerState
  } = useEnergyFormContext();

  const { getStandardFormData } = useProjectForm("standard");

  const standardData = getStandardFormData();
  
  const currentStep = steps[activeStepIndex] || null;

  useEffect(() => {
    createSession()
      .then((data) => {
        setSessionId(data.id);
        if (data.currentStep) {
          setSteps([data.currentStep]);
          setActiveStepIndex(0);
        }
      })
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  }, []);

  function handlePostalCodeSubmit() {
    if (postalCode.length === 5) {
      setShowPostalCode(false);
      setError(undefined);
    } else {
      setError("Le code postal doit contenir 5 chiffres");
    }
  }

  function handleGoToStep(index: number) {
    if (index < 0 || index >= steps.length) return;
    
    setShowSummary(false);
    
    if (index < activeStepIndex) {
      handleBackToStep(index);
    } else {
      setActiveStepIndex(index);
      setAnswerState(steps[index]?.answer || null);
    }
  }

  async function handleBackToStep(targetIndex: number) {
    try {
      setLoading(true);
      
      const stepsToKeep = steps.slice(0, targetIndex + 1);
      setSteps(stepsToKeep);
      setActiveStepIndex(targetIndex);
      
      const targetStep = stepsToKeep[targetIndex];
      setAnswerState(targetStep?.answer || null);
      
      const stepsAfterTarget = steps.slice(targetIndex + 1);
      
      if (stepsAfterTarget.length > 0) {
        if (targetStep?.answer) {
          const patchedStep = await sendStepAnswer(targetStep.id, targetStep.answer, sessionId!);
          
          if (patchedStep.nextStep) {
            setSteps([...stepsToKeep, patchedStep.nextStep]);
          }
        }
      }
    } catch (err: any) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  const getPrefilledValue = (q: any) => {
    if (!q) return null;
    switch (q.label) {
      case "Sa surface habitable (m²) :":
        return standardData.generalInformation.size
          ? Number(standardData.generalInformation.size)
          : null;
      case "Par rapport au logement, vous êtes ?": {
        const label = mapOccupancyStatusToLabel(standardData.occupancyStatus || "");
        return q.choices?.find((c: any) => c.label === label) || null;
      }
      case "Vous habitez": {
        const label = isIleDeFrance(postalCode);
        return q.choices?.find((c: any) => c.label === label) || null;
      }
      case "Nombre d'habitants composant votre foyer fiscal":
        return standardData.householdSize
          ? Number(standardData.householdSize)
          : null;
      case "Revenu annuel moyen de votre foyer fiscal": {
        const label = mapFiscalIncomeToInterval(
          standardData.fiscalIncome || "",
          q.choices || []
        );
        return q.choices?.find((c: any) => c.label === label) || null;
      }
      default:
        return null;
    }
  };

  useEffect(() => {
    if (!currentStep) return;
    const prefill = getPrefilledValue(currentStep.node?.question);
    if (prefill !== null) {
      setAnswerState(prefill);
    } else {
      setAnswerState(currentStep.answer || null);
    }
  }, [currentStep]);

  const SkeletonLoader = () => (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-64 hidden md:block">
        <div className="space-y-3 animate-pulse">
          <div className="h-5 bg-muted rounded w-3/4" />
          <div className="h-5 bg-muted rounded w-1/2" />
          <div className="h-5 bg-muted rounded w-2/3" />
        </div>
      </div>
      <div className="flex-1 space-y-4 animate-pulse">
        <div className="h-6 bg-muted rounded w-1/2" />
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-8 bg-muted rounded w-1/2" />
        <div className="h-10 bg-muted rounded w-1/3" />
      </div>
    </div>
  );

  const formatAnswer = (step: typeof steps[number]) => {
    const qType = step.node?.question?.type;
    const ans = step.answer;
    if (!ans) return "";
    switch (qType) {
      case "QuestionChoice":
        return ans.label;
      case "QuestionChoiceMultiple":
        return Array.isArray(ans) ? ans.map((c: any) => c.label).join(", ") : "";
      default:
        return ans;
    }
  };

  const handleValidate = async () => {
    try {
      setLoading(true);
      const quizSummary = await getQuizSummary(sessionId!);
      if (!quizSummary) throw new Error("No quiz summary found");

      const quizResults = await handleQuizResults({ ...quizSummary, "Code Postal": postalCode });

      if (typeof window !== "undefined") {
        localStorage.setItem("quizResults", JSON.stringify(quizResults));
        localStorage.setItem("quizSteps", JSON.stringify(steps));
      }

      setIsEnergyLabelSolutionsDisplayed(true);
    } catch (err: any) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-0 bg-background text-foreground p-6">
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-0 bg-background text-foreground flex flex-col items-center justify-center">
        <p className="text-red-600 font-semibold mb-4">Erreur: {error}</p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setError(undefined)}
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (showPostalCode) {
    return (
      <div className="min-h-0 bg-background text-foreground flex items-center justify-center p-4">
        <div className="bg-white shadow-md rounded-lg w-full max-w-md overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <Image src="/logo.png" alt="omnicity logo" width={32} height={32} />
            </div>
            <button 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => {
                setIsEnergyFormDisplayed(false);
                setEnergyFormCompleted(false);
                setEnergyFormGotOpened(false);
                setPostalCode("");
                setShowPostalCode(true);
                onQuit?.();
              }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-6">
            <h2 className="text-xl font-bold text-primary mb-6">Améliorer la performance énergétique de mon logement</h2>
            
            <p className="mb-4 text-sm text-muted-foreground">
              Veuillez saisir votre code postal :
            </p>
            <input
              type="text"
              maxLength={5}
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ""))}
              className="w-full border rounded-md px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Code postal"
            />
            <button
              onClick={handlePostalCodeSubmit}
              className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-md hover:bg-primary/90 font-medium"
            >
              Continuer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentStep) {
    return (
      <div className="min-h-0 bg-background text-foreground flex items-center justify-center">
        <p>Aucune question disponible pour le moment.</p>
      </div>
    );
  }

  const question = currentStep.node?.question;
  const questionType = question?.type;
  const questionLabel = question?.label || "";

  if (showSummary) {
    return (
      <div className="min-h-0 bg-background text-foreground flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-6 text-primary text-center">Récapitulatif de vos réponses</h2>
        <div className="flex-1 overflow-auto max-w-3xl w-full mx-auto space-y-4">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => handleGoToStep(idx)}
              className="w-full text-left p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span className="font-medium text-sm text-muted-foreground">{s.node?.question?.label}</span>
              <br />
              <span className="text-base text-foreground">{formatAnswer(s)}</span>
            </button>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleValidate}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-medium hover:bg-primary/90"
          >
            Valider
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-0 bg-background text-foreground flex flex-col">
      <header className="bg-white shadow-sm border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Image src="/logo.png" alt="omnicity logo" width={32} height={32} />
        </div>
        <h1 className="text-primary font-bold text-lg hidden md:block">
          Améliorer la performance énergétique de mon logement
        </h1>
        <button 
          className="text-primary font-medium hover:text-primary/80 flex items-center"
          onClick={() => {
            setIsEnergyFormDisplayed(false);
            setEnergyFormCompleted(false);
            setEnergyFormGotOpened(false);
            setPostalCode("");
            setShowPostalCode(true);
            onQuit?.();
          }}
        >
          <X className="h-5 w-5 mr-1" /> Quitter
        </button>
      </header>

      <div className="flex flex-1">
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-primary text-center">{questionLabel}</h2>

            <div className="space-y-4 mb-8">
              {renderQuestionInputs(
                questionType!,
                question,
                answerState,
                setAnswerState,
                currentStep,
                steps,
                activeStepIndex,
                setSteps,
                setActiveStepIndex,
                setLoading,
                sessionId,
                postalCode,
                setIsEnergyLabelSolutionsDisplayed,
                setError,
                getPrefilledValue(question) !== null,
                setShowSummary
              )}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => handleGoToStep(activeStepIndex - 1)}
                disabled={activeStepIndex === 0}
                className={`border border-primary text-primary px-6 py-3 rounded-md font-medium
                  ${activeStepIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/10'}`}
              >
                Retour
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function renderQuestionInputs(
  questionType: string,
  question: any,
  answerState: any,
  setAnswerState: (val: any) => void,
  currentStep: any,
  steps: any[],
  activeStepIndex: number,
  setSteps: (steps: any[]) => void,
  setActiveStepIndex: (index: number) => void,
  setLoading: (loading: boolean) => void,
  sessionId: string | null,
  postalCode: string,
  setIsEnergyLabelSolutionsDisplayed: (displayed: boolean) => void,
  setError: (error: string | undefined) => void,
  prefilled: boolean,
  setShowSummary: (show: boolean) => void
) {
  const handleAnswer = async (value: any, shouldAutoProceed: boolean = false) => {
    setAnswerState(value);
    if (!currentStep || !shouldAutoProceed) return;
    
    try {
      setLoading(true);
      const patchedStep = await sendStepAnswer(currentStep.id, value, sessionId!);

      const updatedSteps = [...steps];
      updatedSteps[activeStepIndex] = { ...currentStep, answer: value };
      
      if (activeStepIndex < steps.length - 1) {
        updatedSteps.splice(activeStepIndex + 1);
      }
      
      setSteps(updatedSteps);

      if (patchedStep.nextStep) {
        setSteps([...updatedSteps, patchedStep.nextStep]);
        setActiveStepIndex(activeStepIndex + 1);
        setAnswerState(null);
      } else {
        setShowSummary(true);
      }
    } catch (err: any) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleManualProceed = async () => {
    if (!currentStep || !answerState) return;
    
    try {
      setLoading(true);
      const patchedStep = await sendStepAnswer(currentStep.id, answerState, sessionId!);

      const updatedSteps = [...steps];
      updatedSteps[activeStepIndex] = { ...currentStep, answer: answerState };
      
      if (activeStepIndex < steps.length - 1) {
        updatedSteps.splice(activeStepIndex + 1);
      }
      
      setSteps(updatedSteps);

      if (patchedStep.nextStep) {
        setSteps([...updatedSteps, patchedStep.nextStep]);
        setActiveStepIndex(activeStepIndex + 1);
        setAnswerState(null);
      } else {
        setShowSummary(true);
      }
    } catch (err: any) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  switch (questionType) {
    case "QuestionInteger":
    case "QuestionFloat":
      return (
        <div className="flex flex-col gap-2 w-full justify-center items-center">
          <input
            type="text"
            value={answerState || ""}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setAnswerState(value ? Number(value) : null);
            }}
            className="border w-1/2 rounded-[12px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleManualProceed}
            disabled={!answerState}
            className={`bg-primary w-1/2 text-primary-foreground px-6 py-3 rounded-md font-medium mt-4
              ${!answerState ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`}
          >
            Continuer
          </button>
        </div>
      );

    case "QuestionString":
      return (
        <div className="flex flex-col gap-2 w-full justify-center items-center">
          <input
            type="text"
            value={answerState || ""}
            onChange={(e) => setAnswerState(e.target.value)}
            className="border w-1/2 rounded-[12px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleManualProceed}
            disabled={!answerState}
            className={`bg-primary w-1/2 text-primary-foreground px-6 py-3 rounded-md font-medium mt-4
              ${!answerState ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`}
          >
            Continuer
          </button>
        </div>
      );

    case "QuestionChoice":
      if (question?.choices?.length === 2) {
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="flex justify-center items-center gap-4">
              {question.choices.map((choice: any) => (
                <button
                  key={choice.id}
                  onClick={() =>
                    prefilled
                      ? setAnswerState(choice)
                      : handleAnswer(choice, true)
                  }
                  className={`px-8 py-3 rounded-xl border-2 transition-colors
                    ${
                      answerState?.id === choice.id
                        ? "border-primary bg-primary/10"
                        : "border-muted hover:border-primary/50"
                    }`}
                >
                  <span className="text-base font-medium">{choice.label}</span>
                </button>
              ))}
            </div>
            {prefilled && (
              <button
                onClick={handleManualProceed}
                disabled={!answerState}
                className={`bg-primary w-1/2 text-primary-foreground px-6 py-3 rounded-xl font-medium mt-4
                  ${!answerState ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`}
              >
                Continuer
              </button>
            )}
          </div>
        );
      }
      return (
        <div className="flex flex-col items-center">
          <Select
            value={answerState?.id || ""}
            onValueChange={(value) => {
              const choice = question?.choices?.find((c: any) => c.id === value);
              if (choice) {
                if (prefilled) {
                  setAnswerState(choice);
                } else {
                  handleAnswer(choice, true);
                }
              }
            }}
          >
            <SelectTrigger className="w-1/2 p-4 h-auto rounded-xl">
              <SelectValue placeholder="Sélectionnez une option">
                {answerState && (
                  <div className="flex items-center">
                    {questionIcons[question.label]?.[answerState.label] && (
                      <div className="w-6 h-6 mr-3 flex items-center justify-center text-primary">
                        {React.createElement(questionIcons[question.label][answerState.label])}
                      </div>
                    )}
                    <span>{answerState.label}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {question?.choices?.map((choice: any) => {
                const IconComponent = questionIcons[question.label]?.[choice.label];
                return (
                  <SelectItem key={choice.id} value={choice.id}>
                    <div className="flex items-center">
                      {IconComponent && (
                        <div className="w-6 h-6 mr-3 flex items-center justify-center text-primary">
                          <IconComponent />
                        </div>
                      )}
                      <span>{choice.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {prefilled && (
            <button
              onClick={handleManualProceed}
              disabled={!answerState}
              className={`bg-primary w-1/2 text-primary-foreground px-6 py-3 rounded-xl font-medium mt-4
                ${!answerState ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`}
            >
              Continuer
            </button>
          )}
        </div>
      );

    case "QuestionChoiceMultiple": {
      const chosen = Array.isArray(answerState) ? answerState : [];
      
      return (
        <div className="space-y-4 flex flex-col items-center">
          <Select
            onValueChange={(value) => {
              const choice = question?.choices?.find((c: any) => c.id === value);
              if (choice) {
                const isAlreadyChosen = chosen.some((c: any) => c.id === choice.id);
                const newAnswer = isAlreadyChosen 
                  ? chosen.filter((c: any) => c.id !== choice.id)
                  : [...chosen, choice];
                handleAnswer(newAnswer, false);
              }
            }}
          >
            <SelectTrigger className="w-1/2 p-4 h-auto rounded-xl">
              <SelectValue placeholder="Sélectionnez vos options">
                {chosen.length > 0 && (
                  <span>{chosen.length} option{chosen.length > 1 ? 's' : ''} sélectionnée{chosen.length > 1 ? 's' : ''}</span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {question?.choices?.map((choice: any) => {
                const isChecked = chosen.some((c: any) => c.id === choice.id);
                const IconComponent = questionIcons[question.label]?.[choice.label];
                return (
                  <SelectItem key={choice.id} value={choice.id}>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-3"
                        checked={isChecked}
                        readOnly
                      />
                      {IconComponent && (
                        <div className="w-6 h-6 mr-3 flex items-center justify-center text-primary">
                          <IconComponent />
                        </div>
                      )}
                      <span>{choice.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          
          {chosen.length > 0 && (
            <button
              onClick={handleManualProceed}
              className="bg-primary w-1/2 text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90"
            >
              Continuer
            </button>
          )}
        </div>
      );
    }

    default:
      return <p>Type de question non géré : {questionType}</p>;
  }
}