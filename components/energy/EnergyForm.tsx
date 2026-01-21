"use client";

import React, { useState } from "react";
import { useEnergyFormContext } from "@/contexts/energyForm.context";
import { X } from "lucide-react";
import Image from "next/image";
import { useProjectForm } from "@/hooks/useProjectForm";

export default function EnergyForm({ onQuit }: { onQuit?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [address, setAddress] = useState("");

  const { setIsEnergyLabelSolutionsDisplayed } = useEnergyFormContext();

  const { getStandardFormData } = useProjectForm("standard");
  const standardData = getStandardFormData();

  const handleSubmit = async () => {
    if (!address.trim()) {
      setError("L'adresse est requise");
      return;
    }

    try {
      setLoading(true);
      setError(undefined);

      // TODO: Appel API avec l'adresse pour récupérer les résultats énergétiques
      // const results = await fetchEnergyResultsByAddress(address);

      // Mock des résultats en attendant la nouvelle API
      const mockResults = {
        energyRating: "D",
        recommendations: ["Isolation des combles", "Changement de chauffage"],
        estimatedSavings: "30%",
        address: address,
        timestamp: new Date().toISOString(),
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("quizResults", JSON.stringify(mockResults));
      }

      setIsEnergyLabelSolutionsDisplayed(true);
    } catch (err: any) {
      setError(
        err.message ||
          "Une erreur est survenue lors de la récupération des résultats",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-0 bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Analyse de votre bien en cours...</p>
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
          onClick={() => onQuit?.()}
        >
          <X className="h-5 w-5 mr-1" /> Quitter
        </button>
      </header>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-primary text-center">
            Estimation énergétique de votre bien
          </h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium mb-2"
              >
                Adresse du bien
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Entrez l'adresse complète de votre bien"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ex: 123 Rue de la République, 75001 Paris
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !address.trim()}
              className={`w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium mt-6
                ${!address.trim() || loading ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90"}`}
            >
              {loading
                ? "Analyse en cours..."
                : "Obtenir mon estimation énergétique"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
