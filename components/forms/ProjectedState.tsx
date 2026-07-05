"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Euro, Zap, Home, CheckCircle } from "lucide-react";
import { KelvinProjectedStateResponse } from "@/types/simulation.types";

interface ProjectedStateProps {
  projectedState: KelvinProjectedStateResponse;
  address: string;
  onContinue: () => void;
  onBack: () => void;
}

export default function ProjectedState({
  projectedState,
  address,
  onContinue,
  onBack,
}: ProjectedStateProps) {
  const renovationPlans =
    projectedState?.projected_state?.renovation_plans || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatSavings = (savings: number) => {
    return `${savings} kWh/an`;
  };

  const getRenovationLevelColor = (level: string) => {
    switch (level) {
      case "basic":
        return "bg-green-100 text-green-800 border-green-200";
      case "intermediate":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "advanced":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRenovationLevelLabel = (level: string) => {
    switch (level) {
      case "basic":
        return "Essentiel";
      case "intermediate":
        return "Intermédiaire";
      case "advanced":
        return "Avancé";
      default:
        return level;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          🚀 Scénarios de Rénovation
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Adresse: <span className="font-medium">{address}</span>
        </p>
        <p className="text-xs text-gray-500">
          Découvrez les différents niveaux de rénovation possibles pour
          améliorer votre performance énergétique
        </p>
      </div>

      {renovationPlans.length === 0 ? (
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardContent className="text-center p-8">
            <p className="text-yellow-800 dark:text-yellow-200 font-medium text-lg mb-2">
              ⚠️ Aucun plan de rénovation disponible
            </p>
            <p className="text-yellow-600 dark:text-yellow-300 text-sm">
              Les données de rénovation ne sont pas encore disponibles pour ce
              bâtiment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {renovationPlans.map((plan, index) => (
            <Card
              key={plan.id}
              className="border-gray-200 dark:border-gray-800 shadow-lg"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Home className="w-6 h-6 text-blue-600" />
                    Rénovation {getRenovationLevelLabel(plan.name)}
                  </CardTitle>
                  <Badge
                    className={`${getRenovationLevelColor(plan.name)} px-3 py-1`}
                  >
                    {getRenovationLevelLabel(plan.name)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Métriques principales */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                    <Zap className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-green-600">
                      {plan.dpe_after_renovation}
                    </div>
                    <div className="text-xs text-green-700 dark:text-green-300">
                      Nouvelle classe DPE
                    </div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-blue-600">
                      {formatSavings(plan.yearly_energy_savings)}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">
                      Économies annuelles
                    </div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
                    <Euro className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-orange-600">
                      {formatCurrency(plan.yearly_energy_cost)}
                    </div>
                    <div className="text-xs text-orange-700 dark:text-orange-300">
                      Coût annuel après
                    </div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-purple-600">
                      {formatCurrency(plan.budget - plan.subsidies)}
                    </div>
                    <div className="text-xs text-purple-700 dark:text-purple-300">
                      Reste à charge
                    </div>
                  </div>
                </div>

                {/* Détails financiers */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Détails financiers
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Budget total:
                      </span>
                      <span className="font-medium">
                        {formatCurrency(plan.budget)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Aides/Subventions:
                      </span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(plan.subsidies)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2 md:border-t-0 md:pt-0">
                      <span className="text-gray-600 dark:text-gray-400">
                        Reste à charge:
                      </span>
                      <span className="font-bold text-purple-600">
                        {formatCurrency(plan.budget - plan.subsidies)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Travaux de rénovation */}
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    Travaux inclus
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(plan.renovation_plan).map(
                      ([key, renovation]) => (
                        <div
                          key={key}
                          className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-900 border rounded-lg"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {renovation.label}
                            </div>
                            <div className="text-xs text-gray-500">
                              Quantité: {renovation.quantity}
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex justify-between pt-6">
        <Button onClick={onBack} variant="outline" className="px-6">
          ← Retour à l'état initial
        </Button>
        <Button
          onClick={onContinue}
          className="px-6 bg-blue-600 hover:bg-blue-700"
        >
          Continuer vers les solutions →
        </Button>
      </div>
    </div>
  );
}
