"use client";

import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import Taxi from "./Taxi";
import World from "./World";
import CameraFollow from "./CameraFollow";

export default function Scene() {
  const taxiRef = useRef<THREE.Group>(null);

  return (
    <Canvas
      shadows
      camera={{
        position: [12, 10, 16],
        fov: 50,
        near: 0.1,
        far: 300,
      }}
    >
      {/* Cielo */}
      <color attach="background" args={["#87ceeb"]} />

      {/* Iluminación ambiental */}
      <ambientLight intensity={0.5} />

      {/* Sol */}
      <directionalLight
        position={[30, 40, 20]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={150}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
      />

      <World />

      <Taxi ref={taxiRef} />

      <CameraFollow target={taxiRef} />
    </Canvas>
  );
}