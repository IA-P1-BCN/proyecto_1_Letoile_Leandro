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

  /*
   * INICIAR / REINICIAR VIAJE
   */
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

  /*
   * FINALIZAR VIAJE
   */
  const handleFinish = () => {
    if (tripState !== "running") {
      return;
    }

    setSpeed(0);
    setVehicleStatus("stopped");
    setTripState("finished");
  };

  /*
   * CONTROLES DE TECLADO
   *
   * Este hook solo conoce las teclas.
   * No decide la tarifa.
   */
  const controls = useTaxiControls({
    onStart: handleStart,
    onFinish: handleFinish,
  });

  /*
   * ESTADO VISUAL DEL TAXÍMETRO
   */
  const status: TaxiStatus =
    tripState === "finished"
      ? "finished"
      : tripState === "idle"
        ? "idle"
        : vehicleStatus === "moving"
          ? "moving"
          : "stopped";

  /*
   * COBRO
   *
   * IMPORTANTE:
   *
   * No miramos ArrowUp.
   * No miramos ArrowDown.
   *
   * Miramos el ESTADO REAL DEL VEHÍCULO.
   *
   * moving  → 0.05 €/s
   * stopped → 0.02 €/s
   */
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

        /*
         * El intervalo corre cada 100 ms,
         * por eso cobramos 1/10 de la tarifa
         * correspondiente a un segundo.
         */
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