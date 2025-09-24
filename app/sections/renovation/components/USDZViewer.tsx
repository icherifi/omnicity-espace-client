"use client";
import { useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Plus, Minus } from "lucide-react";
import { USDZLoader } from "three-usdz-loader";
import * as THREE from "three";
import { Button } from "@/components/ui/button";

interface USDZViewerProps {
  documentPath: string;
  documentName: string;
  hideInfo?: boolean;
  /** Désactive le zoom via la molette/pinch */
  disableScrollZoom?: boolean;
  /** Affiche les boutons + / - pour zoomer */
  showZoomButtons?: boolean;
  /** Position initiale de la caméra [x, y, z] */
  initialCameraPosition?: [number, number, number];
  /** Angle de vue initial (en degrés) */
  initialCameraRotation?: [number, number, number];
}

function USDZModel({ url }: { url: string }) {
  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!url || !ref.current) return;
    const loader = new USDZLoader();
    let loadedModel: any;
    let group = ref.current;

    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "model.usdz", { type: "model/vnd.usdz+zip" });
        return loader.loadFile(file, group);
      })
      .then(model => {
        loadedModel = model;
      });

    return () => {
      if (loadedModel && loadedModel.clean) loadedModel.clean();
      while (group.children.length) group.remove(group.children[0]);
    };
  }, [url]);

  return <group ref={ref} />;
}

function Scene({ modelUrl, onControlsReady, disableScrollZoom = false, initialCameraPosition, initialCameraRotation }: { 
  modelUrl: string; 
  onControlsReady: (controls: any) => void; 
  disableScrollZoom?: boolean;
  initialCameraPosition?: [number, number, number];
  initialCameraRotation?: [number, number, number];
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (controlsRef.current) {
      onControlsReady(controlsRef.current);
    }
  }, [onControlsReady]);

  // Appliquer la position et rotation initiales de la caméra
  useEffect(() => {
    if (initialCameraPosition) {
      camera.position.set(...initialCameraPosition);
    }
    if (initialCameraRotation) {
      camera.rotation.set(
        THREE.MathUtils.degToRad(initialCameraRotation[0]),
        THREE.MathUtils.degToRad(initialCameraRotation[1]),
        THREE.MathUtils.degToRad(initialCameraRotation[2])
      );
    }
    camera.updateMatrixWorld();
  }, [camera, initialCameraPosition, initialCameraRotation]);

  return (
    <>
      <color attach="background" args={["#fff"]} />
      {/* Lumière ambiante plus forte */}
      <ambientLight intensity={1.2} />
      {/* Plusieurs lumières directionnelles */}
      <directionalLight position={[10, 10, 10]} intensity={1.5} />
      <directionalLight position={[-10, 10, 10]} intensity={1.2} />
      <directionalLight position={[0, -10, 10]} intensity={0.8} />
      {/* Lumière ponctuelle supplémentaire */}
      <pointLight position={[0, 10, 10]} intensity={1.2} />
      <USDZModel url={modelUrl} />
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={!disableScrollZoom}
        enableRotate={true}
        minDistance={0.5}
        maxDistance={50}
        dampingFactor={0.05}
        enableDamping={true}
      />
    </>
  );
}

export default function USDZViewer({ 
  documentPath, 
  documentName, 
  hideInfo, 
  disableScrollZoom = false, 
  showZoomButtons = false,
  initialCameraPosition,
  initialCameraRotation
}: USDZViewerProps) {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [controls, setControls] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoading(true);
        setError(null);

        // Créer une URL signée pour le fichier USDZ
        const { data, error } = await supabase.storage
          .from("documents")
          .createSignedUrl(documentPath, 3600); // 1 heure

        if (error) {
          throw new Error(`Erreur lors du chargement du modèle: ${error.message}`);
        }

        if (!data?.signedUrl) {
          throw new Error("Impossible de récupérer l'URL du modèle");
        }

        setModelUrl(data.signedUrl);
      } catch (err) {
        console.error("Erreur lors du chargement du modèle USDZ:", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    loadModel();
  }, [documentPath]);

  const handleZoomIn = () => {
    if (controls) {
      const distance = controls.getDistance();
      const newDistance = Math.max(distance * 0.8, 0.5);
      const ratio = newDistance / distance;
      const direction = new THREE.Vector3();
      direction.copy(controls.object.position).sub(controls.target).multiplyScalar(ratio);
      controls.object.position.copy(direction.add(controls.target));
      controls.update();
    }
  };

  const handleZoomOut = () => {
    if (controls) {
      const distance = controls.getDistance();
      const newDistance = Math.min(distance * 1.2, 50);
      const ratio = newDistance / distance;
      const direction = new THREE.Vector3();
      direction.copy(controls.object.position).sub(controls.target).multiplyScalar(ratio);
      controls.object.position.copy(direction.add(controls.target));
      controls.update();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement du modèle 3D...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Vérifiez que le fichier {documentName} est bien un fichier USDZ valide.
          </p>
        </div>
      </div>
    );
  }

  if (!modelUrl) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Modèle non disponible</h3>
          <p className="text-gray-600">Le modèle 3D n'a pas pu être chargé.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-200 relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        className="w-full h-full"
        gl={{ antialias: true, alpha: false }}
      >
        <Scene modelUrl={modelUrl} onControlsReady={setControls} disableScrollZoom={disableScrollZoom} initialCameraPosition={initialCameraPosition} initialCameraRotation={initialCameraRotation} />
      </Canvas>

      {showZoomButtons && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            onClick={handleZoomIn}
            size="sm"
            variant="secondary"
            className="w-10 h-10 p-0 rounded-full bg-white/80 hover:bg-white/90 shadow-lg"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleZoomOut}
            size="sm"
            variant="secondary"
            className="w-10 h-10 p-0 rounded-full bg-white/80 hover:bg-white/90 shadow-lg"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      )}

      {!hideInfo && (
        <>
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg text-sm">
            <div className="font-medium">{documentName}</div>
            <div className="text-xs opacity-75">
              Utilisez la souris pour naviguer
            </div>
          </div>
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <div className="bg-black/50 text-white p-2 rounded-lg text-xs">
              <div className="font-medium mb-1">Navigation</div>
              <div>🖱️ Clic gauche + glisser : Rotation</div>
              <div>🔍 Boutons + et - : Zoom</div>
              <div>🖱️ Clic droit + glisser : Pan</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 