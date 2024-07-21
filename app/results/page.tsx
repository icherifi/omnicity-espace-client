// pages/form.js
"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

// Helper function to format numbers
const formatCurrency = (value: any) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
};

const Results = () => {
  const searchParams = useSearchParams();
  const data = searchParams.get("data");
  let parsedData;

  try {
    parsedData = data ? JSON.parse(decodeURIComponent(data)) : {};
  } catch (e) {
    parsedData = {};
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Résultats</h1>
      {parsedData && parsedData.bouquets ? (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">
            Étiquette Énergétique Initiale:{" "}
            {parsedData.etiquetteEnergetiqueInitial}
          </h2>
          <div className="space-y-4">
            {parsedData.bouquets.map((bouquet: any, index: any) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg shadow">
                <h3 className="text-lg font-bold mb-2">Bouquet {index + 1}</h3>
                <p>Confort: {bouquet.confort}</p>
                <p>Valeur Verte: {bouquet.valeurVerte.toFixed(2)}</p>
                <p>Renovation Murs: {bouquet.renovationMurs ? "Oui" : "Non"}</p>
                <p>
                  Reno Isolation Toiture Terrasse:{" "}
                  {bouquet.renoIsolationToitureTerrasse ? "Oui" : "Non"}
                </p>
                <p>
                  Pourcentage Gain CEP:{" "}
                  {(bouquet.pourcentageGainCEP * 100).toFixed(2)}%
                </p>
                <p>Étiquette: {bouquet.etiquette}</p>
                <p>Montant Aides: {formatCurrency(bouquet.montantAides)}</p>
                <p>Catégories Aides: {bouquet.categoriesAides}</p>
                <p>Coût Total: {formatCurrency(bouquet.coutTotal)}</p>
                <p>Reste à Charge: {formatCurrency(bouquet.resteACharge)}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Aucune donnée disponible</p>
      )}
    </div>
  );
};

export default Results;
