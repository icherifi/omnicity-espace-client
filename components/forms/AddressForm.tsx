"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AddressFormProps {
  address: string;
  loading: boolean;
  onAddressChange: (address: string) => void;
  onSubmit: (address: string) => void;
  onQuit: () => void;
}

export default function AddressForm({
  address,
  loading,
  onAddressChange,
  onSubmit,
  onQuit,
}: AddressFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      onSubmit(address);
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
              onChange={(e) => onAddressChange(e.target.value)}
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
                  Validation...
                </>
              ) : (
                "Continuer"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
