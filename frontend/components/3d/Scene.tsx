"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import Taxi from "./Taxi";
import World from "./World";
import CameraFollow from "./CameraFollow";
import Taximeter from "./Taximeter";
import StartInstructions from "./StartInstructions";
import useTaxiControls from "./controls/TaxiControls";

type TripState =
  | "idle"
  | "running"
  | "finished";

type TaxiStatus =
  | "idle"
  | "moving"
  | "stopped"
  | "finished";

export default function Scene() {
  const taxiRef = useRef<THREE.Group>(null);

  const [speed, setSpeed] = useState(0);
  const [amount, setAmount] = useState(0);

  const [tripState, setTripState] =
    useState<TripState>("idle");

  const handleStart = () => {
    if (
      tripState !== "idle" &&
      tripState !== "finished"
    ) {
      return;
    }

    setAmount(0);
    setSpeed(0);
    setTripState("running");
  };

  const handleStop = () => {
    setSpeed(0);
  };

  const handleFinish = () => {
    if (tripState !== "running") {
      return;
    }

    setSpeed(0);
    setTripState("finished");
  };

  const controls = useTaxiControls({
    onStart: handleStart,
    onStop: handleStop,
    onFinish: handleFinish,
  });

  const status: TaxiStatus =
    tripState === "finished"
      ? "finished"
      : tripState === "idle"
        ? "idle"
        : Math.abs(speed) > 0.1
          ? "moving"
          : "stopped";

  useEffect(() => {
    if (tripState !== "running") {
      return;
    }

    const interval = setInterval(() => {
      setAmount((currentAmount) => {
        const pricePerSecond =
          Math.abs(speed) > 0.1
            ? 0.05
            : 0.02;

        return (
          currentAmount +
          pricePerSecond * 0.1
        );
      });
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [tripState, speed]);

  return (
    <>
      <Canvas
        shadows
        camera={{
          position: [0, 14, 68],
          fov: 65,
          near: 0.1,
          far: 300,
        }}
      >
        <color
          attach="background"
          args={["#87ceeb"]}
        />

        <ambientLight intensity={0.5} />

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

        {/* 
          El cartel forma parte del mundo 3D.
          Permanece visible durante todo el viaje.
        */}
        <StartInstructions visible />

        <Taxi
          ref={taxiRef}
          controls={controls}
          tripActive={tripState === "running"}
          onSpeedChange={setSpeed}
        />

        <CameraFollow
          target={taxiRef}
          started={tripState === "running"}
        />
      </Canvas>

      <Taximeter
        amount={amount}
        status={status}
      />
    </>
  );
}