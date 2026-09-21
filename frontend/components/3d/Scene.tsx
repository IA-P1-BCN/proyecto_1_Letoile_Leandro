"use client";

import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import Taxi from "./Taxi";
import World from "./World";
import CameraFollow from "./CameraFollow";
import Taximeter from "./Taximeter";
import StartInstructions from "./StartInstructions";
import FinishSequence from "./finish/FinishSequence";
import useTaxiControls from "./controls/TaxiControls";

import useTaximeterController from "../../hooks/useTaximeterController";

type TaxiStatus =
  | "idle"
  | "moving"
  | "stopped"
  | "finished";

export default function Scene() {
  const taxiRef =
    useRef<THREE.Group>(null);

  const {
    tripState,
    vehicleStatus,
    amount,
    handleStart,
    handleFinish,
    handleVehicleStatusChange,
    handleFinishSequence,
  } = useTaximeterController();

  // =====================================================
  // CONTROLES
  // =====================================================

  const controls = useTaxiControls({
    onStart: handleStart,
    onFinish: handleFinish,
  });

  // =====================================================
  // ESTADO VISUAL DEL TAXÍMETRO
  // =====================================================

  const status: TaxiStatus =
    tripState === "finished"
      ? "finished"
      : tripState === "idle"
        ? "idle"
        : tripState === "finishing"
          ? "stopped"
          : vehicleStatus === "moving"
            ? "moving"
            : "stopped";

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      <Canvas
        camera={{
          position: [-1, 4.5, 86],
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

        <StartInstructions visible={true} />

        <Taxi
          ref={taxiRef}
          controls={controls}
          tripActive={
            tripState === "running"
          }
          visible={
            tripState !== "idle"
          }
          onSpeedChange={() => {}}
          onVehicleStatusChange={
            handleVehicleStatusChange
          }
        />

        <FinishSequence
          taxiRef={taxiRef}
          active={
            tripState === "finishing"
          }
          onFinished={
            handleFinishSequence
          }
        />

        <CameraFollow
          target={taxiRef}
          started={
            tripState === "running"
          }
          intro={
            tripState === "idle"
          }
          finishing={
            tripState === "finishing"
          }
          finished={
            tripState === "finished"
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