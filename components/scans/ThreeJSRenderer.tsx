"use client";

import React, { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import * as THREE from "three";
import { RoomShell } from "./RoomShell";
import { Scan, Transform, useTransform } from "./useTransform";

interface ThreeJSRendererProps {
  scanData: Scan;
  viewMode: "2D" | "3D";
  showDimensions?: boolean;
  selectedWalls?: Set<number>;
  onWallClick?: (wallIndex: number) => void;
  cameraTarget?: [number, number, number];
}

// Component to handle dynamic camera positioning
const CameraController: React.FC<{
  is3D: boolean;
  cameraTarget?: [number, number, number];
}> = ({ is3D, cameraTarget }) => {
  const { camera } = useThree();

  useEffect(() => {
    const target = cameraTarget
      ? new THREE.Vector3(...cameraTarget)
      : new THREE.Vector3(0, 0, 0);

    if (is3D) {
      const offset = new THREE.Vector3(10, 10, 10);
      camera.position.copy(target).add(offset);
      camera.up.set(0, 1, 0); // Set up vector for 3D view
    } else {
      camera.position.set(target.x, target.y + 20, target.z); // Look down from above (Y-axis)
      camera.up.set(0, 0, 1); // Set up vector for 2D top-down view (Z points up)
    }
    camera.lookAt(target);
  }, [camera, is3D, cameraTarget]);

  return null;
};

// Component for rendering objects/furniture
const RoomObject: React.FC<{ transform: Transform; is3D: boolean }> = ({
  transform,
  is3D,
}) => {
  const { position, rotation, dimensions } = useTransform(transform, is3D);

  const width = dimensions[0];
  const height = is3D ? dimensions[1] || 0.8 : 0.1;
  const depth = dimensions[2] || width;

  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color="#4A90E2" wireframe={!is3D} />
    </mesh>
  );
};

// Main room scene component
const RoomScene: React.FC<{
  scanData: Scan;
  is3D: boolean;
  showDimensions: boolean;
  selectedWalls?: Set<number>;
  onWallClick?: (wallIndex: number) => void;
}> = ({ scanData, is3D, showDimensions, selectedWalls, onWallClick }) => {
  return (
    <group>
      <RoomShell
        scanData={scanData}
        is3D={is3D}
        showDimensions={showDimensions}
        selectedWalls={selectedWalls}
        onWallClick={onWallClick}
      />

      {/* Render objects */}
      {scanData.objects?.map((object, index) => (
        <RoomObject key={`object-${index}`} transform={object} is3D={is3D} />
      ))}
    </group>
  );
};

const ThreeJSRenderer: React.FC<ThreeJSRendererProps> = ({
  scanData,
  viewMode,
  showDimensions = false,
  selectedWalls,
  onWallClick,
  cameraTarget,
}) => {
  const is3D = viewMode === "3D";

  return (
    <div className="w-full h-[600px] border rounded-lg overflow-hidden">
      <Canvas
        camera={{
          position: is3D ? [10, 10, 10] : [0, 20, 0],
          fov: 50,
        }}
      >
        {/* Dynamic camera controller */}
        <CameraController is3D={is3D} cameraTarget={cameraTarget} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
        <pointLight position={[-10, -10, -5]} intensity={0.3} />

        {/* Grid for reference */}
        <Grid
          renderOrder={-1}
          position={[0, 0, 0]}
          infiniteGrid
          cellSize={1}
          cellThickness={0.5}
          sectionSize={5}
          sectionThickness={1}
          sectionColor={"#4A90E2"}
          cellColor={"#cccccc"}
          fadeDistance={30}
          fadeStrength={1}
        />

        {/* Room content */}
        <RoomScene
          scanData={scanData}
          is3D={is3D}
          showDimensions={showDimensions}
          selectedWalls={selectedWalls}
          onWallClick={onWallClick}
        />

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={is3D}
          target={cameraTarget || [0, 0, 0]}
        />
      </Canvas>
    </div>
  );
};

export default ThreeJSRenderer;
