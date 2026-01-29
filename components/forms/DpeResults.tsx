"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  KelvinDpeData,
  formatDpeDate,
  getEnergyClassColor,
  getEnergyClassDescription,
} from "@/utils/kelvinApi";
import { CalendarDays, Home, MapPin, Ruler, Zap } from "lucide-react";

interface DpeResultsProps {
  dpeData: KelvinDpeData;
  onConfirm: (data: KelvinDpeData) => void;
  onBack: () => void;
  loading?: boolean;
}

export default function DpeResults({
  dpeData,
  onConfirm,
  onBack,
  loading = false,
}: DpeResultsProps) {
  // Console log pour debug
  console.log("Classe énergétique:", dpeData.energy_class);
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-xl">
          Informations DPE récupérées
        </CardTitle>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Vérifiez que ces informations correspondent à votre logement
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Classes énergétiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="h-4 w-4" />
                <span className="font-medium">Classe énergétique</span>
              </div>
              <Badge
                className={`${getEnergyClassColor(dpeData.energy_class)} text-white text-lg px-4 py-2`}
              >
                {dpeData.energy_class}
              </Badge>
              <p className="text-xs text-gray-500 mt-1">
                {getEnergyClassDescription(dpeData.energy_class)}
              </p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="h-4 w-4" />
                <span className="font-medium">Émissions GES</span>
              </div>
              <Badge
                className={`${getEnergyClassColor(dpeData.emission_class)} text-white text-lg px-4 py-2`}
              >
                {dpeData.emission_class}
              </Badge>
              <p className="text-xs text-gray-500 mt-1">Classe d'émission</p>
            </div>
          </div>

          {/* Informations du logement */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <MapPin className="h-4 w-4 mt-0.5 text-gray-600" />
              <div className="flex-1">
                <p className="font-medium text-sm">Adresse</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {dpeData.address}
                </p>
                {dpeData.address_complement && (
                  <p className="text-xs text-gray-500 mt-1">
                    {dpeData.address_complement}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Ruler className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="font-medium text-sm">Surface</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {dpeData.surface} m²
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Home className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="font-medium text-sm">Type</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {dpeData.building_type === "house"
                      ? "Maison"
                      : dpeData.building_type === "apartment"
                        ? "Appartement"
                        : dpeData.building_type}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <CalendarDays className="h-4 w-4 text-gray-600" />
              <div>
                <p className="font-medium text-sm">Date du rapport</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {formatDpeDate(dpeData.report_date)}
                </p>
              </div>
            </div>
          </div>

          {/* Informations techniques */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">DPE ID:</span>
                <span className="ml-2 font-mono">{dpeData.dpe_id}</span>
              </div>
              <div>
                <span className="text-gray-500">Version:</span>
                <span className="ml-2">{dpeData.dpe_version}</span>
              </div>
              <div>
                <span className="text-gray-500">BAN ID:</span>
                <span className="ml-2 font-mono">{dpeData.ban_id}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
              disabled={loading}
            >
              Retour
            </Button>
            <Button
              type="button"
              onClick={() => onConfirm(dpeData)}
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Simulation en cours...
                </>
              ) : (
                "Lancer la simulation énergétique"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
