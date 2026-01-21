"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateMockResultsByAddress } from "@/utils/mockData";

interface AddressOnlyFormProps {
  projectId?: string;
  onSuccess: (results?: any) => void;
  onError: (error: string) => void;
  onQuit: () => void;
}

export default function AddressOnlyForm({
  projectId,
  onSuccess,
  onError,
  onQuit,
}: AddressOnlyFormProps) {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.trim()) {
      onError("L'adresse est requise");
      return;
    }

    setLoading(true);

    try {
      // Générer des résultats mock basés sur l'adresse
      const mockResults = generateMockResultsByAddress(address);

      // Simuler un délai d'appel API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log(
        "Résultats mock générés pour l'adresse:",
        address,
        mockResults,
      );

      // Passer les résultats à la fonction de succès
      onSuccess(mockResults);
    } catch (error) {
      console.error("Erreur lors du traitement de l'adresse:", error);
      onError("Une erreur est survenue lors du traitement de l'adresse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-xl">
          Estimation énergétique par adresse
        </CardTitle>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Notre nouvelle technologie permet d'estimer la performance énergétique
          de votre logement simplement avec son adresse.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="property-address" className="text-sm font-medium">
              Adresse du bien
            </Label>
            <Input
              id="property-address"
              type="text"
              placeholder="Entrez l'adresse complète du bien"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Ex: 123 Rue de la République, 75001 Paris
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onQuit}
              className="flex-1"
            >
              Retour
            </Button>
            <Button
              type="submit"
              disabled={loading || !address.trim()}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Traitement...
                </>
              ) : (
                "Générer l'estimation"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
