"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useProgress } from "@react-three/drei";
import * as THREE from "three";

import Taxi from "./Taxi";
import World from "./World";
import CameraFollow from "./CameraFollow";
import Taximeter from "./Taximeter";
import StartInstructions from "./StartInstructions";
import FinishSequence from "./finish/FinishSequence";
import useTaxiControls from "./controls/TaxiControls";
import RideHistory from "./history/RideHistory";

import useTaximeterController from "../../hooks/useTaximeterController";

type TaxiStatus =
  | "idle"
  | "moving"
  | "stopped"
  | "finished";

type SceneProps = {
  historyOpen: boolean;
  onHistoryOpenChange: (open: boolean) => void;
  onReady?: () => void;
};

function SceneReady({
  onReady,
}: {
  onReady?: () => void;
}) {
  const { progress, active } = useProgress();
  const minimumDelayRef = useRef(false);
  const readyRef = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      minimumDelayRef.current = true;

      if (
        !readyRef.current &&
        progress >= 100 &&
        !active
      ) {
        readyRef.current = true;
        onReady?.();
      }
    }, 800);

    return () => {
      window.clearTimeout(timer);
    };
  }, [onReady, progress, active]);

  useEffect(() => {
    if (
      !readyRef.current &&
      minimumDelayRef.current &&
      progress >= 100 &&
      !active
    ) {
      readyRef.current = true;
      onReady?.();
    }
  }, [progress, active, onReady]);

  return null;
}

export default function Scene({
  historyOpen,
  onHistoryOpenChange,
  onReady,
}: SceneProps) {
  const taxiRef = useRef<THREE.Group>(null);

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

        <SceneReady onReady={onReady} />

        <World />

        <StartInstructions visible={true} />

        <Taxi
          ref={taxiRef}
          controls={controls}
          tripActive={tripState === "running"}
          visible={tripState !== "idle"}
          onSpeedChange={() => {}}
          onVehicleStatusChange={
            handleVehicleStatusChange
          }
        />

        <FinishSequence
          taxiRef={taxiRef}
          active={tripState === "finishing"}
          onFinished={handleFinishSequence}
        />

        <CameraFollow
          target={taxiRef}
          started={tripState === "running"}
          intro={tripState === "idle"}
          finishing={tripState === "finishing"}
          finished={tripState === "finished"}
        />
      </Canvas>

      {/* =====================================================
          TAXÍMETRO
          ===================================================== */}

      <Taximeter
        amount={amount}
        status={status}
      />

      {/* =====================================================
          HISTORIAL
          ===================================================== */}

      <RideHistory
        open={historyOpen}
        onOpenChange={onHistoryOpenChange}
      />
    </>
  );
}