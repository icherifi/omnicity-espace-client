import { useState, useEffect, useRef, useCallback } from "react";

interface UseKelvinMapProps {
  address: string;
  onSelectionChange: (data: {
    latitude?: number;
    longitude?: number;
    banId?: string;
    address?: any;
  }) => void;
}

// Configuration pour la librairie kelvin
const KELVIN_API_KEY = process.env.NEXT_PUBLIC_KELVIN_API_KEY ?? "";
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

declare global {
  interface Window {
    kelvin: {
      map: {
        init: (config: any) => any;
      };
    };
  }
}

export function useKelvinMap({
  address,
  onSelectionChange,
}: UseKelvinMapProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const kelvinMapRef = useRef<any>(null);

  // Géocodage d'adresse via notre API locale
  const geocodeAddress = useCallback(async (addressQuery: string) => {
    try {
      console.log(`🌍 Géocodage de l'adresse: "${addressQuery}"`);

      const response = await fetch(
        `/api/mapbox/geocode?address=${encodeURIComponent(addressQuery)}`,
      );

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(
            `Aucune coordonnée trouvée pour l'adresse: ${addressQuery}`,
          );
          return null;
        }
        throw new Error(`Erreur géocodage: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Coordonnées trouvées pour "${addressQuery}":`, {
        latitude: data.latitude,
        longitude: data.longitude,
      });
      return { latitude: data.latitude, longitude: data.longitude };
    } catch (error) {
      console.error("Erreur lors du géocodage:", error);
      return null;
    }
  }, []);

  const initializeMap = useCallback(async () => {
    // Éviter les réinitialisations multiples
    if (isInitialized || kelvinMapRef.current) {
      console.log("Carte déjà initialisée, abandon");
      return;
    }

    try {
      console.log("Initialisation de la carte Kelvin avec géocodage...");

      // Géocoder l'adresse pour obtenir les coordonnées
      const coordinates = await geocodeAddress(address);

      const kelvinConfig: any = {
        apiKey: KELVIN_API_KEY,
        mapboxAccessToken: MAPBOX_ACCESS_TOKEN,
        htmlTargetId: "kelvin-map",
      };

      // Ajouter la position initiale si on a trouvé des coordonnées
      if (coordinates) {
        kelvinConfig.initialPosition = {
          latitude: coordinates.latitude.toString(),
          longitude: coordinates.longitude.toString(),
        };
        console.log(
          "Position initiale configurée:",
          kelvinConfig.initialPosition,
        );
      } else {
        console.log(
          "Aucune coordonnée trouvée, utilisation des paramètres par défaut",
        );
      }

      const kelvinMap = window.kelvin.map.init(kelvinConfig);

      if (kelvinMap) {
        kelvinMapRef.current = kelvinMap;
        setIsInitialized(true);
        console.log("Carte Kelvin initialisée avec succès");

        // Écouter l'événement de chargement de la carte
        kelvinMap.on("map:loaded", function () {
          console.log("Carte kelvin chargée avec succès");

          // Si on a des coordonnées, naviguer vers cette position après le chargement
          if (coordinates) {
            setTimeout(() => {
              try {
                kelvinMap.travelTo({
                  latitude: coordinates.latitude.toString(),
                  longitude: coordinates.longitude.toString(),
                });
                console.log(
                  "Navigation vers la position de l'adresse effectuée",
                );
              } catch (error) {
                console.error("Erreur lors de la navigation:", error);
              }
            }, 1000);
          }
        });

        // Écouter l'événement de sélection de polygone
        kelvinMap.on("polygon:selected", function (payload: string) {
          try {
            const parsedPayload = JSON.parse(payload);
            console.log("Polygone sélectionné:", parsedPayload);
            console.log("Latitude:", parsedPayload.latitude);
            console.log("Longitude:", parsedPayload.longitude);
            console.log("Ban ID:", parsedPayload.ban_id);
            console.log("Adresse complète:", parsedPayload.address);

            onSelectionChange({
              latitude: parsedPayload.latitude,
              longitude: parsedPayload.longitude,
              banId: parsedPayload.ban_id,
              address: parsedPayload.address,
            });
          } catch (error) {
            console.error(
              "Erreur lors du parsing des données de sélection:",
              error,
            );
          }
        });

        // Écouter l'événement de mouvement de carte
        kelvinMap.on("map:moved", function (event: any) {
          // Réduire le logging pour éviter le spam
        });
      } else {
        console.error("Échec de l'initialisation de la carte Kelvin");
        throw new Error("Échec de l'initialisation de la carte Kelvin");
      }
    } catch (error) {
      console.error(
        "Erreur lors de l'initialisation de la carte kelvin:",
        error,
      );
      throw error;
    }
  }, [address, geocodeAddress, onSelectionChange]);

  // Charger le script kelvin
  useEffect(() => {
    const loadKelvinScript = () => {
      if (document.getElementById("kelvin-script")) {
        setScriptLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.id = "kelvin-script";
      script.src =
        "https://cdn.jsdelivr.net/npm/kelvin-js@0.0.7/dist/kelvin-map-iframe-v0.0.5.min.js";
      script.onload = () => {
        console.log("Script kelvin chargé avec succès");
        setScriptLoaded(true);
      };
      script.onerror = (error) => {
        console.error("Erreur lors du chargement du script kelvin:", error);
        setScriptLoaded(false);
      };

      document.head.appendChild(script);
    };

    loadKelvinScript();

    return () => {
      // Cleanup function if needed
    };
  }, []);

  return {
    scriptLoaded,
    initializeMap,
    isInitialized,
    kelvinMapRef,
  };
}
