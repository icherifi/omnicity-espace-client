"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, MapPin, Thermometer, Zap, Users } from "lucide-react";
import { InitialState } from "@/types/simulation.types";

interface InitialStateDiagnosticsDisplayProps {
  initialState: InitialState;
  address: string;
}

export default function InitialStateDiagnosticsDisplay({
  initialState,
  address,
}: InitialStateDiagnosticsDisplayProps) {
  // Extraire les informations de l'état initial
  const data = initialState || {};

  const formatSurface = (surface: number) => {
    if (!surface) return "Non spécifiée";
    return `${surface} m²`;
  };

  const formatYear = (year: number) => {
    if (!year) return "Inconnue";
    return year.toString();
  };

  const formatEnergyClass = (energyClass: string) => {
    if (!energyClass) return "Non spécifiée";
    return energyClass.toUpperCase();
  };

  const formatCost = (costRange: any) => {
    if (!costRange || !costRange.min || !costRange.max) return "Non spécifié";
    return `${costRange.min}€ - ${costRange.max}€`;
  };

  const formatConsumption = (consumption: number) => {
    if (!consumption) return "Non spécifiée";
    return `${consumption} kWh/m²/an`;
  };

  const formatPercentage = (percentage: number) => {
    if (percentage === undefined || percentage === null) return "Non spécifié";
    return `${Math.round(percentage * 100)}%`;
  };

  const formatEnergyType = (type: string) => {
    const types = {
      gas: "Gaz",
      electricity: "Électricité",
      fuel: "Fioul",
      wood: "Bois",
      boiler: "Chaudière",
    };
    return types[type as keyof typeof types] || type || "Non spécifié";
  };

  const formatInsulation = (level: string) => {
    const levels = {
      very_good: "Très bonne",
      good: "Bonne",
      middle_class: "Moyenne",
      low: "Faible",
      very_low: "Très faible",
    };
    return levels[level as keyof typeof levels] || level || "Non spécifiée";
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          🏠 État Initial du Bâtiment
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Adresse: <span className="font-medium">{address}</span>
        </p>
        <p className="text-xs text-gray-500">
          Voici les informations actuelles de votre bâtiment avant simulation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Informations du bâtiment */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Home className="w-5 h-5 text-blue-600" />
              Caractéristiques du bâtiment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Surface habitable:
              </span>
              <span className="font-medium">
                {formatSurface(data.living_area)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Année de construction:
              </span>
              <span className="font-medium">
                {formatYear(data.construction_year)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Nombre d'étages:
              </span>
              <span className="font-medium">
                {data.house_number_of_levels || "Non spécifié"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Surface murs extérieurs:
              </span>
              <span className="font-medium">
                {formatSurface(data.exterior_walls_surface)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Matériau des murs:
              </span>
              <span className="font-medium">
                {data.wall_material || "Non spécifié"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Nombre de fenêtres:
              </span>
              <span className="font-medium">
                {data.number_of_windows || "Non spécifié"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Informations énergétiques */}
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-green-600" />
              Performance énergétique
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Classe DPE:
              </span>
              <span className="font-bold text-2xl text-green-600">
                {formatEnergyClass(data.dpe_class)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Score de confiance:
              </span>
              <span className="font-medium">
                {formatPercentage(data.confidence_score)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Consommation annuelle:
              </span>
              <span className="font-medium">
                {formatConsumption(data.annual_energy_consumption)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Coût énergétique annuel:
              </span>
              <span className="font-medium">
                {formatCost(data.annual_energy_cost_range)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Position dans le quartier:
              </span>
              <span className="font-medium">
                {formatPercentage(data.position_percentage_neighborhood)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Isolation et pertes énergétiques */}
        <Card className="border-orange-200 dark:border-orange-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Thermometer className="w-5 h-5 text-orange-600" />
              Isolation et pertes énergétiques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Isolation murs:
              </span>
              <span className="font-medium">
                {formatInsulation(data.u_walls)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Isolation fenêtres:
              </span>
              <span className="font-medium">
                {formatInsulation(data.u_windows)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Isolation plancher haut:
              </span>
              <span className="font-medium">
                {formatInsulation(data.u_high_floor)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Isolation plancher bas:
              </span>
              <span className="font-medium">
                {formatInsulation(data.u_low_floor)}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
              <div className="text-sm font-medium mb-1">
                Répartition des pertes:
              </div>
              {data.energy_loss_percentage && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    Murs: {formatPercentage(data.energy_loss_percentage.walls)}
                  </div>
                  <div>
                    Ouvertures:{" "}
                    {formatPercentage(data.energy_loss_percentage.openings)}
                  </div>
                  <div>
                    Plancher bas:{" "}
                    {formatPercentage(data.energy_loss_percentage.low_floor)}
                  </div>
                  <div>
                    Plancher haut:{" "}
                    {formatPercentage(data.energy_loss_percentage.high_floor)}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Systèmes et équipements */}
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-purple-600" />
              Systèmes et équipements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Type de chauffage:
              </span>
              <span className="font-medium">
                {formatEnergyType(data.generator_type)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Énergie chauffage:
              </span>
              <span className="font-medium">
                {formatEnergyType(data.generator_energy)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Type eau chaude:
              </span>
              <span className="font-medium">
                {formatEnergyType(data.hot_water_type)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Énergie eau chaude:
              </span>
              <span className="font-medium">
                {formatEnergyType(data.hot_water_energy)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Ventilation:
              </span>
              <span className="font-medium">
                {data.has_vents ? data.vents_type || "Présente" : "Absente"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Garage:
              </span>
              <span className="font-medium">{data.garage ? "Oui" : "Non"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informations complémentaires */}
      {(data.close_to_historical_monument ||
        data.shared_walls ||
        data.recently_renovated?.length > 0) && (
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5 text-gray-600" />
              Informations complémentaires
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Monument historique proche:
              </span>
              <span className="font-medium">
                {data.close_to_historical_monument ? "Oui" : "Non"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Murs mitoyens:
              </span>
              <span className="font-medium">
                {data.shared_walls ? "Oui" : "Non"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Type plancher haut:
              </span>
              <span className="font-medium">
                {data.high_floor_type || "Non spécifié"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Type plancher bas:
              </span>
              <span className="font-medium">
                {data.low_floor_type || "Non spécifié"}
              </span>
            </div>
            {data.recently_renovated && data.recently_renovated.length > 0 && (
              <div className="pt-2 border-t">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Récemment rénové:
                </span>
                <div className="mt-1">
                  {data.recently_renovated.map(
                    (item: string, index: number) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1"
                      >
                        {item}
                      </span>
                    ),
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
