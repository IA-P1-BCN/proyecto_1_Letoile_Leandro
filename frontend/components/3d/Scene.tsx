"use client";

import { Canvas } from "@react-three/fiber";
import Taxi from "./Taxi";
import World from "./World";

export default function Scene() {
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

      <Taxi />
    </Canvas>
  );
}