"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import Taxi from "./Taxi";
import World from "./World";
import CameraFollow from "./CameraFollow";
import Taximeter from "./Taximeter";

type TaxiStatus = "idle" | "moving" | "stopped";

export default function Scene() {
  const taxiRef = useRef<THREE.Group>(null);

  const [speed, setSpeed] = useState(0);
  const [amount, setAmount] = useState(0);

  const status: TaxiStatus =
    Math.abs(speed) > 0.1
      ? "moving"
      : amount > 0
        ? "stopped"
        : "idle";

  useEffect(() => {
    if (status === "idle") {
      return;
    }

    const interval = setInterval(() => {
      setAmount((currentAmount) => {
        const pricePerSecond =
          status === "moving"
            ? 0.05
            : 0.02;

        return currentAmount + pricePerSecond * 0.1;
      });
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [status]);

  return (
    <>
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
        <color
          attach="background"
          args={["#87ceeb"]}
        />

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

        <Taxi
          ref={taxiRef}
          onSpeedChange={setSpeed}
        />

        <CameraFollow target={taxiRef} />
      </Canvas>

      <Taximeter
        amount={amount}
        status={status}
      />
    </>
  );
}