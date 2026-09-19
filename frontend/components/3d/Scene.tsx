"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import Taxi, {
  type VehicleStatus,
} from "./Taxi";

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
  const taxiRef =
    useRef<THREE.Group>(null);

  const [speed, setSpeed] =
    useState(0);

  const [vehicleStatus, setVehicleStatus] =
    useState<VehicleStatus>("stopped");

  const [amount, setAmount] =
    useState(0);

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
    setVehicleStatus("stopped");
    setTripState("running");
  };

  const handleFinish = () => {
    if (tripState !== "running") {
      return;
    }

    setSpeed(0);
    setVehicleStatus("stopped");
    setTripState("finished");
  };

  const controls = useTaxiControls({
    onStart: handleStart,
    onFinish: handleFinish,
  });

  const status: TaxiStatus =
    tripState === "finished"
      ? "finished"
      : tripState === "idle"
        ? "idle"
        : vehicleStatus === "moving"
          ? "moving"
          : "stopped";

  useEffect(() => {
    if (tripState !== "running") {
      return;
    }

    const interval = setInterval(() => {
      setAmount((currentAmount) => {
        const pricePerSecond =
          vehicleStatus === "moving"
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
  }, [tripState, vehicleStatus]);

  return (
    <>
      <Canvas
        camera={{
          position: [0, 10, 50],
          fov: 65,
          near: 0.1,
          far: 180,
        }}
      >
        <color
          attach="background"
          args={["#07111f"]}
        />

        <ambientLight intensity={1.2} />

        <directionalLight
          position={[30, 40, 20]}
          intensity={1.4}
        />

        <World />

        <StartInstructions visible />

        <Taxi
          ref={taxiRef}
          controls={controls}
          tripActive={
            tripState === "running"
          }
          onSpeedChange={setSpeed}
          onVehicleStatusChange={
            setVehicleStatus
          }
        />

        <CameraFollow
          target={taxiRef}
          started={
            tripState === "running"
          }
        />
      </Canvas>

      <Taximeter
        amount={amount}
        status={status}
      />
    </>
  );
}