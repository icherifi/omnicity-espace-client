"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, Text } from "@react-three/drei";
import * as THREE from "three";

interface Transform {
  transform: number[];
  dimensions: number[];
}

interface Scan {
  name: string;
  walls?: Transform[];
  doors?: Transform[];
  openings?: Transform[];
  windows?: Transform[];
  objects?: Transform[];
}

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

// Component for rendering walls
const Wall: React.FC<{
  transform: Transform;
  is3D: boolean;
  showDimensions: boolean;
  wallIndex: number;
  isSelected: boolean;
  onWallClick?: (wallIndex: number) => void;
}> = ({
  transform,
  is3D,
  showDimensions,
  wallIndex,
  isSelected,
  onWallClick,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const { position, rotation, dimensions } = useMemo(() => {
    const matrix = new THREE.Matrix4();
    matrix.fromArray(transform.transform);

    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    matrix.decompose(position, quaternion, scale);

    const euler = new THREE.Euler();
    euler.setFromQuaternion(quaternion);

    return {
      position: [position.x, is3D ? position.y : 0, position.z] as [
        number,
        number,
        number
      ],
      rotation: [euler.x, euler.y, euler.z] as [number, number, number],
      dimensions: transform.dimensions,
    };
  }, [transform, is3D]);

  const width = dimensions[0];
  const height = is3D ? dimensions[1] : 0.1;
  const depth = 0.2; // Wall thickness

  const handleClick = (event: any) => {
    event.stopPropagation();
    onWallClick?.(wallIndex);
  };

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        rotation={rotation}
        onClick={handleClick}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={isSelected ? "#ff6b35" : "#666666"}
          emissive={isSelected ? "#ff6b35" : "#000000"}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>
      {showDimensions && width > 0.5 && (
        <Text
          position={[position[0], position[1] + 0.5, position[2]]}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {`${width.toFixed(1)}m`}
        </Text>
      )}
    </group>
  );
};

// Component for rendering doors
const Door: React.FC<{ transform: Transform; is3D: boolean }> = ({
  transform,
  is3D,
}) => {
  const { position, rotation, dimensions } = useMemo(() => {
    const matrix = new THREE.Matrix4();
    matrix.fromArray(transform.transform);

    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    matrix.decompose(position, quaternion, scale);

    const euler = new THREE.Euler();
    euler.setFromQuaternion(quaternion);

    return {
      position: [position.x, is3D ? position.y : 0, position.z] as [
        number,
        number,
        number
      ],
      rotation: [euler.x, euler.y, euler.z] as [number, number, number],
      dimensions: transform.dimensions,
    };
  }, [transform, is3D]);

  const width = dimensions[0];
  const height = is3D ? dimensions[1] || 2.1 : 0.15;
  const depth = 0.05;

  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color="#8B4513" />
    </mesh>
  );
};

// Component for rendering windows
const Window: React.FC<{ transform: Transform; is3D: boolean }> = ({
  transform,
  is3D,
}) => {
  const { position, rotation, dimensions } = useMemo(() => {
    const matrix = new THREE.Matrix4();
    matrix.fromArray(transform.transform);

    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    matrix.decompose(position, quaternion, scale);

    const euler = new THREE.Euler();
    euler.setFromQuaternion(quaternion);

    return {
      position: [position.x, is3D ? position.y : 0, position.z] as [
        number,
        number,
        number
      ],
      rotation: [euler.x, euler.y, euler.z] as [number, number, number],
      dimensions: transform.dimensions,
    };
  }, [transform, is3D]);

  const width = dimensions[0];
  const height = is3D ? dimensions[1] || 1.2 : 0.1;
  const depth = 0.03;

  return (
    <group>
      {/* Window frame */}
      <mesh position={position} rotation={rotation}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#4A90E2" transparent opacity={0.6} />
      </mesh>
      {/* Window frame border */}
      <mesh position={position} rotation={rotation}>
        <boxGeometry args={[width + 0.05, height + 0.05, depth]} />
        <meshStandardMaterial color="#333333" wireframe />
      </mesh>
    </group>
  );
};

// Component for rendering openings
const Opening: React.FC<{ transform: Transform; is3D: boolean }> = ({
  transform,
  is3D,
}) => {
  const { position, rotation, dimensions } = useMemo(() => {
    const matrix = new THREE.Matrix4();
    matrix.fromArray(transform.transform);

    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    matrix.decompose(position, quaternion, scale);

    const euler = new THREE.Euler();
    euler.setFromQuaternion(quaternion);

    return {
      position: [position.x, is3D ? position.y : 0, position.z] as [
        number,
        number,
        number
      ],
      rotation: [euler.x, euler.y, euler.z] as [number, number, number],
      dimensions: transform.dimensions,
    };
  }, [transform, is3D]);

  const width = dimensions[0];
  const height = is3D ? dimensions[1] || 2.1 : 0.1;

  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[width, height, 0.01]} />
      <meshStandardMaterial color="#FF0000" wireframe />
    </mesh>
  );
};

// Component for rendering objects/furniture
const RoomObject: React.FC<{ transform: Transform; is3D: boolean }> = ({
  transform,
  is3D,
}) => {
  const { position, rotation, dimensions } = useMemo(() => {
    const matrix = new THREE.Matrix4();
    matrix.fromArray(transform.transform);

    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    matrix.decompose(position, quaternion, scale);

    const euler = new THREE.Euler();
    euler.setFromQuaternion(quaternion);

    return {
      position: [position.x, is3D ? position.y : 0, position.z] as [
        number,
        number,
        number
      ],
      rotation: [euler.x, euler.y, euler.z] as [number, number, number],
      dimensions: transform.dimensions,
    };
  }, [transform, is3D]);

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
      {/* Render walls */}
      {scanData.walls?.map((wall, index) => (
        <Wall
          key={`wall-${index}`}
          wallIndex={index}
          transform={wall}
          is3D={is3D}
          showDimensions={showDimensions}
          isSelected={selectedWalls?.has(index) || false}
          onWallClick={onWallClick}
        />
      ))}

      {/* Render doors */}
      {scanData.doors?.map((door, index) => (
        <Door key={`door-${index}`} transform={door} is3D={is3D} />
      ))}

      {/* Render windows */}
      {scanData.windows?.map((window, index) => (
        <Window key={`window-${index}`} transform={window} is3D={is3D} />
      ))}

      {/* Render openings */}
      {scanData.openings?.map((opening, index) => (
        <Opening key={`opening-${index}`} transform={opening} is3D={is3D} />
      ))}

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
