import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const ModelViewer = () => {
  const { scene } = useGLTF("models-test/Room.gltf");

  return (
    <Canvas>
      <ambientLight intensity={1} />
      <directionalLight position={[2, 5, 2]} intensity={1} />
      <primitive object={scene} />
      <OrbitControls />
    </Canvas>
    
  );
}

export default ModelViewer;
