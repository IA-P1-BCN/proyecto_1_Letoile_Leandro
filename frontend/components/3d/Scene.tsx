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
      camera={{
        position: [12, 10, 16],
        fov: 50,
      }}
    >
      <color attach="background" args={["#87ceeb"]} />

      <ambientLight intensity={0.7} />

      <directionalLight
        position={[20, 30, 10]}
        intensity={2}
      />

      <World />

      <Taxi ref={taxiRef} />

      <CameraFollow target={taxiRef} />
    </Canvas>
  );
}