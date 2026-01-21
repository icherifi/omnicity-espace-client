"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProjectService } from "@/services/project.service";
import {
  generateMockResultsByAddress,
  generateMockResultsByDpe,
} from "@/utils/mockData";

export default function TestMockData() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAddressMock = async () => {
    setLoading(true);
    try {
      const mockData = generateMockResultsByAddress(
        "123 Rue de la République, 75001 Paris",
      );
      setTestResults({
        type: "address",
        data: mockData,
      });
    } catch (error) {
      console.error("Erreur test adresse mock:", error);
    } finally {
      setLoading(false);
    }
  };

  const testDpeMock = async () => {
    setLoading(true);
    try {
      const mockData = generateMockResultsByDpe("1234567890123");
      setTestResults({
        type: "dpe",
        data: mockData,
      });
    } catch (error) {
      console.error("Erreur test DPE mock:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Test des données mock</h2>

      <div className="space-x-4">
        <Button onClick={testAddressMock} disabled={loading}>
          Test Mock Adresse
        </Button>
        <Button onClick={testDpeMock} disabled={loading}>
          Test Mock DPE
        </Button>
      </div>

      {loading && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p>Génération des données mock...</p>
        </div>
      )}

      {testResults && (
        <div className="mt-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">
            Résultats Mock ({testResults.type})
          </h3>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
            {JSON.stringify(testResults.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
