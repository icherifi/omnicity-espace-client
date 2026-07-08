"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useKelvinMap } from "../../hooks/useKelvinMap";

interface KelvinMapComponentProps {
  address: string;
  selectedData: {
    latitude?: number;
    longitude?: number;
    banId?: string;
    address?: any;
  };
  loading: boolean;
  onSelectionChange: (data: {
    latitude?: number;
    longitude?: number;
    banId?: string;
    address?: any;
  }) => void;
  onConfirmSelection: () => void;
  onBackToAddress: () => void;
}

export default function KelvinMapComponent({
  address,
  selectedData,
  loading,
  onSelectionChange,
  onConfirmSelection,
  onBackToAddress,
}: KelvinMapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { scriptLoaded, initializeMap, isInitialized } = useKelvinMap({
    address,
    onSelectionChange,
  });

  useEffect(() => {
    if (scriptLoaded && !isInitialized) {
      initializeMap();
    }
  }, [scriptLoaded, isInitialized, initializeMap]);

  return (
    <div className="w-full min-h-screen space-y-4">
      {/* Header informatif */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">Sélectionnez votre bâtiment</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Adresse: <span className="font-medium">{address}</span>
        </p>
        <p className="text-sm text-gray-500">
          Cliquez sur votre bâtiment pour le sélectionner précisément
        </p>
        {selectedData.latitude &&
          selectedData.longitude &&
          selectedData.banId && (
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800 max-w-md mx-auto">
              <p className="text-sm text-green-700 dark:text-green-300 text-center">
                ✅ Bâtiment sélectionné: {selectedData.latitude},{" "}
                {selectedData.longitude}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 text-center">
                BAN ID: {selectedData.banId}
              </p>
            </div>
          )}
      </div>

      {/* Container pour la carte kelvin - Moitié de l'écran */}
      <div
        id="kelvin-map"
        ref={mapContainerRef}
        className="w-full border border-gray-200 dark:border-gray-700 rounded-lg"
        style={{
          height: "50vh",
          minHeight: "400px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {!scriptLoaded && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Chargement de la carte...</span>
          </div>
        )}
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-2 pt-4 max-w-md mx-auto">
        <Button
          type="button"
          variant="outline"
          onClick={onBackToAddress}
          className="flex-1"
        >
          Retour à l'adresse
        </Button>
        <Button
          type="button"
          onClick={onConfirmSelection}
          disabled={
            loading ||
            !selectedData.latitude ||
            !selectedData.longitude ||
            !selectedData.banId
          }
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Simulation en cours...
            </>
          ) : (
            "Lancer la simulation"
          )}
        </Button>
      </div>
    </div>
  );
}
