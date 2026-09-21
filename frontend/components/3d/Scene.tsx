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
import FinishSequence from "./finish/FinishSequence";
import useTaxiControls from "./controls/TaxiControls";

import {
  startRide,
  moveRide,
  stopRide,
  finishRide,
  getTaximeterState,
  getTaximeterCurrent,
} from "../../lib/api/taximeter";

type TripState =
  | "idle"
  | "running"
  | "finishing"
  | "finished";

type TaxiStatus =
  | "idle"
  | "moving"
  | "stopped"
  | "finished";

export default function Scene() {
  const taxiRef = useRef<THREE.Group>(null);

  const [speed, setSpeed] = useState(0);

  const [vehicleStatus, setVehicleStatus] =
    useState<VehicleStatus>("stopped");

  const [amount, setAmount] = useState(0);

  const [tripState, setTripState] =
    useState<TripState>("idle");

  const transitionInProgressRef =
    useRef(false);

  const backendVehicleStatusRef =
    useRef<VehicleStatus>("stopped");

  const backendQueueRef =
    useRef<Promise<void>>(Promise.resolve());

  // =====================================================
  // BACKEND QUEUE
  // =====================================================

  const enqueueBackendAction = (
    action: () => Promise<void>
  ) => {
    backendQueueRef.current =
      backendQueueRef.current.then(action);

    return backendQueueRef.current;
  };

  // =====================================================
  // RECUPERAR CARRERA DESPUÉS DE REFRESH
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const recoverActiveRide = async () => {
      try {
        const state =
          await getTaximeterState();

        if (cancelled) return;

        // Hay una carrera activa
        if (
          state.state === "moving" ||
          state.state === "stopped"
        ) {
          const current =
            await getTaximeterCurrent();

          if (cancelled) return;

          setAmount(current.total);

          setVehicleStatus(
            state.state === "moving"
              ? "moving"
              : "stopped"
          );

          backendVehicleStatusRef.current =
            state.state === "moving"
              ? "moving"
              : "stopped";

          setSpeed(0);

          setTripState("running");

          return;
        }

        // No hay carrera activa
        setAmount(0);
        setSpeed(0);
        setVehicleStatus("stopped");

        backendVehicleStatusRef.current =
          "stopped";

        setTripState("idle");
      } catch (error) {
        if (cancelled) return;

        console.error(
          "Error recuperando el estado del taxímetro:",
          error
        );
      }
    };

    recoverActiveRide();

    return () => {
      cancelled = true;
    };
  }, []);

  // =====================================================
  // START
  // =====================================================

  const handleStart = async () => {
    if (transitionInProgressRef.current) {
      return;
    }

    if (
      tripState !== "idle" &&
      tripState !== "finished"
    ) {
      return;
    }

    transitionInProgressRef.current = true;

    // Limpiamos inmediatamente el importe visual.
    // El valor real de la nueva carrera
    // será confirmado por el backend debajo.
    setAmount(0);

    try {
      await enqueueBackendAction(
        async () => {
          // Iniciar nueva carrera
          await startRide();

          // El backend es la fuente de verdad.
          // Consultamos el current de la nueva carrera.
          const current =
            await getTaximeterCurrent();

          setAmount(current.total);
        }
      );

      setSpeed(0);

      setVehicleStatus("stopped");

      backendVehicleStatusRef.current =
        "stopped";

      setTripState("running");
    } catch (error) {
      console.error(
        "Error iniciando la carrera:",
        error
      );
    } finally {
      transitionInProgressRef.current = false;
    }
  };

  // =====================================================
  // FINISH
  // =====================================================

  const handleFinish = async () => {
    if (transitionInProgressRef.current) {
      return;
    }

    if (tripState !== "running") {
      return;
    }

    transitionInProgressRef.current = true;

    try {
      await enqueueBackendAction(
        async () => {
          const response =
            await finishRide();

          // Conservamos el importe final
          // de la carrera recién terminada.
          setAmount(response.total);
        }
      );

      setSpeed(0);

      setVehicleStatus("stopped");

      backendVehicleStatusRef.current =
        "stopped";

      setTripState("finishing");
    } catch (error) {
      console.error(
        "Error finalizando la carrera:",
        error
      );
    } finally {
      transitionInProgressRef.current = false;
    }
  };

  // =====================================================
  // CAMBIO DE ESTADO DEL TAXI
  // =====================================================

  const handleVehicleStatusChange = (
    status: VehicleStatus
  ) => {
    setVehicleStatus(status);

    if (tripState !== "running") {
      return;
    }

    if (transitionInProgressRef.current) {
      return;
    }

    if (
      backendVehicleStatusRef.current ===
      status
    ) {
      return;
    }

    backendVehicleStatusRef.current =
      status;

    if (status === "moving") {
      enqueueBackendAction(
        async () => {
          await moveRide();
        }
      );

      return;
    }

    if (status === "stopped") {
      enqueueBackendAction(
        async () => {
          await stopRide();
        }
      );
    }
  };

  // =====================================================
  // CONTROLES
  // =====================================================

  const controls = useTaxiControls({
    onStart: handleStart,
    onFinish: handleFinish,
  });

  // =====================================================
  // ESTADO PARA EL TAXÍMETRO VISUAL
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
  // SINCRONIZAR PRECIO CON BACKEND
  // =====================================================

  useEffect(() => {
    if (tripState !== "running") {
      return;
    }

    let cancelled = false;

    const syncTaximeter = async () => {
      try {
        const current =
          await getTaximeterCurrent();

        if (cancelled) {
          return;
        }

        setAmount(current.total);
      } catch (error) {
        console.error(
          "Error sincronizando taxímetro:",
          error
        );
      }
    };

    syncTaximeter();

    const interval =
      window.setInterval(
        syncTaximeter,
        250
      );

    return () => {
      cancelled = true;

      window.clearInterval(
        interval
      );
    };
  }, [tripState]);

  // =====================================================
  // FIN DE ANIMACIÓN
  // =====================================================

  const handleFinishSequence = () => {
    setSpeed(0);
    setVehicleStatus("stopped");
    setTripState("finished");
  };

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
          onSpeedChange={setSpeed}
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