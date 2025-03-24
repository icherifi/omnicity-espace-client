"use client";

import React, { useEffect, useState } from "react";
import { createSession, sendStepAnswer, getQuizSummary, handleQuizResults } from "@/utils/handleEnergyFormData";
import { useEnergyFormContext } from "@/contexts/energyForm.context";
import { CheckCircle, X } from 'lucide-react';
import Image from "next/image";
import { Progress } from "@/components/ui/progress";

export default function EnergyForm() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const { sessionId, setSessionId, setIsEnergyFormDisplayed, setEnergyFormCompleted, setEnergyFormGotOpened, setIsEnergyLabelSolutionsDisplayed } = useEnergyFormContext();
  const { postalCode, setPostalCode, 
  showPostalCode, setShowPostalCode, 
  steps, setSteps, activeStepIndex, 
  setActiveStepIndex, answerState, setAnswerState } = useEnergyFormContext();
  
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

  async function handleSendAnswer() {
    if (!currentStep) return;
    try {
      setLoading(true);
      const patchedStep = await sendStepAnswer(currentStep.id, answerState);

      const updatedSteps = [...steps];
      updatedSteps[activeStepIndex] = { ...currentStep, answer: answerState };
      setSteps(updatedSteps);

      if (patchedStep.nextStep) {
        setSteps([...updatedSteps, patchedStep.nextStep]);
        setActiveStepIndex(activeStepIndex + 1);
        setAnswerState(null);
      } else {
        const quizSummary = await getQuizSummary(sessionId!);
        if (!quizSummary) throw new Error("No quiz summary found");

        const quizResults = await handleQuizResults({ ...quizSummary, "Code Postal": postalCode });

        if (typeof window !== "undefined") {
          localStorage.setItem("quizResults", JSON.stringify(quizResults));
          localStorage.setItem("quizSteps", JSON.stringify(updatedSteps));
        }
        
        setIsEnergyLabelSolutionsDisplayed(true);
      }
    } catch (err: any) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  function handleGoToStep(index: number) {
    if (index < 0 || index >= steps.length) return;
    setActiveStepIndex(index);
    setAnswerState(steps[index]?.answer || null);
  }

  const SkeletonLoader = () => (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-64 hidden md:block">
        <div className="space-y-3 animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-5 bg-gray-200 rounded w-1/2" />
          <div className="h-5 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
      <div className="flex-1 space-y-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-8 bg-gray-200 rounded w-1/2" />
        <div className="h-10 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-0 bg-gray-50 text-gray-800 p-6">
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-0 bg-gray-50 text-gray-800 flex flex-col items-center justify-center">
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
      <div className="min-h-0 bg-gray-50 text-gray-800 flex items-center justify-center p-4">
        <div className="bg-white shadow-md rounded-lg w-full max-w-md overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <Image src="/logo.png" alt="omnicity logo" width={32} height={32} />
            </div>
            <button onClick={() => setIsEnergyFormDisplayed(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-6">
            <h2 className="text-xl font-bold text-primary mb-6">Améliorer la performance énergétique de mon logement</h2>
            
            <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
              <div className="h-full bg-primary rounded-full w-1/4"></div>
            </div>
            
            <p className="mb-4 text-sm text-gray-700">
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
      <div className="min-h-0 bg-gray-50 text-gray-800 flex items-center justify-center">
        <p>Aucune question disponible pour le moment.</p>
      </div>
    );
  }

  const question = currentStep.node?.question;
  const questionType = question?.type;
  const questionLabel = question?.label || "";

  return (
    <div className="min-h-0 bg-gray-50 text-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Image src="/logo.png" alt="omnicity logo" width={32} height={32} />
        </div>
        <h1 className="text-primary font-bold text-lg hidden md:block">
          Améliorer la performance énergétique de mon logement
        </h1>
        <button onClick={() => {
          setIsEnergyFormDisplayed(false)
          setEnergyFormCompleted(false)
          setEnergyFormGotOpened(false)
        }} className="text-primary font-medium hover:text-primary/80 flex items-center">
          <X className="h-5 w-5 mr-1" /> Quitter
        </button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:block bg-white shadow-md w-80 p-6 border-r">
          <h3 className="text-lg font-bold mb-6 text-primary">Votre parcours</h3>
          <ul className="space-y-1">
            {steps.map((step, i) => {
              const label = step.node?.question?.label || `Étape ${i + 1}`;
              const isActive = i === activeStepIndex;
              const isCompleted = i < activeStepIndex;
              
              return (
                <li key={step.id || i} className="relative pl-7">
                  {isCompleted ? (
                    <CheckCircle className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                  ) : (
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full border-2 
                      ${isActive ? 'border-primary' : 'border-gray-300'}`}>
                      {isActive && (
                        <div className="absolute inset-0.5 rounded-full bg-primary"></div>
                      )}
                    </div>
                  )}
                  <button
                    onClick={() => handleGoToStep(i)}
                    className={`block w-full text-left py-2 text-sm transition-colors
                      ${isActive ? 'font-semibold text-primary' : isCompleted ? 'text-gray-700' : 'text-gray-500'}`}
                  >
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-primary">{questionLabel}</h2>

            <div className="space-y-4 mb-8">
              {renderQuestionInputs(questionType!, question, answerState, setAnswerState)}
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
              <button
                onClick={handleSendAnswer}
                disabled={!answerState}
                className={`bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium flex-1
                  ${!answerState ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`}
              >
                Continuer
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
  setAnswerState: (val: any) => void
) {
  switch (questionType) {
    case "QuestionInteger":
    case "QuestionFloat":
      return (
        <input
          type="number"
          value={answerState || ""}
          onChange={(e) => setAnswerState(Number(e.target.value))}
          className="border rounded-md w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      );

    case "QuestionString":
      return (
        <input
          type="text"
          value={answerState || ""}
          onChange={(e) => setAnswerState(e.target.value)}
          className="border rounded-md w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      );

    case "QuestionChoice":
      return (
        <div className="space-y-3">
          {question?.choices?.map((choice: any) => (
            <div
              key={choice.id}
              onClick={() => setAnswerState(choice)}
              className={`w-full p-4 rounded-lg border-2 transition-colors cursor-pointer
                ${answerState?.id === choice.id 
                  ? 'border-primary bg-primary/10' 
                  : 'border-gray-200 hover:border-gray-300'}`}
            >
              <label className="flex items-center w-full cursor-pointer">
                <input
                  type="radio"
                  className="sr-only"
                  checked={answerState?.id === choice.id}
                  onChange={() => setAnswerState(choice)}
                />
                <span className="text-base">{choice.label}</span>
              </label>
            </div>
          ))}
        </div>
      );

    case "QuestionChoiceMultiple": {
      const chosen = Array.isArray(answerState) ? answerState : [];
      return (
        <div className="space-y-3">
          {question?.choices?.map((c: any) => {
            const isChecked = chosen.some((x: any) => x.id === c.id);
            return (
              <div
                key={c.id}
                onClick={() => {
                  if (isChecked) {
                    setAnswerState(chosen.filter((x: any) => x.id !== c.id));
                  } else {
                    setAnswerState([...chosen, c]);
                  }
                }}
                className={`w-full p-4 rounded-lg border-2 transition-colors cursor-pointer
                  ${isChecked 
                    ? 'border-primary bg-primary/10' 
                    : 'border-gray-200 hover:border-gray-300'}`}
              >
                <label className="flex items-center w-full cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isChecked}
                    onChange={() => {
                      if (isChecked) {
                        setAnswerState(chosen.filter((x: any) => x.id !== c.id));
                      } else {
                        setAnswerState([...chosen, c]);
                      }
                    }}
                  />
                  <span className="text-base">{c.label}</span>
                </label>
              </div>
            );
          })}
        </div>
      );
    }

    default:
      return <p>Type de question non géré : {questionType}</p>;
  }
}