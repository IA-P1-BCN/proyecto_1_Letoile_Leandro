"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

import Passenger from "./Passenger";

type FinishSequenceProps = {
  taxiRef: React.RefObject<THREE.Group | null>;
  active: boolean;
  onFinished?: () => void;
};

type FinishPhase =
  | "idle"
  | "approaching"
  | "waiting"
  | "passenger"
  | "done";

export default function FinishSequence({
  taxiRef,
  active,
  onFinished,
}: FinishSequenceProps) {
  const [phase, setPhase] =
    useState<FinishPhase>("idle");

  const elapsed = useRef(0);

  const startPosition = useRef(
    new THREE.Vector3()
  );

  // =====================================================
  // POSICIÓN FINAL DEL TAXI
  // =====================================================

  const taxiTargetPosition = useRef(
    new THREE.Vector3(
      0,
      0.25,
      8.5
    )
  );

  // =====================================================
  // RESET DE LA SECUENCIA
  // =====================================================

  if (!active && phase !== "idle") {
    setPhase("idle");
    elapsed.current = 0;
  }

  useFrame((_, delta) => {
    if (!active) {
      return;
    }

    const taxi = taxiRef.current;

    if (!taxi) {
      return;
    }

    elapsed.current += delta;

    // =====================================================
    // INICIO
    // =====================================================

    if (phase === "idle") {
      startPosition.current.copy(
        taxi.position
      );

      setPhase("approaching");

      return;
    }

    // =====================================================
    // TAXI SE ACERCA A LA ZONA FINAL
    // =====================================================

    if (phase === "approaching") {
      const duration = 2.2;

      const progress = Math.min(
        elapsed.current / duration,
        1
      );

      const easedProgress =
        progress *
        progress *
        (3 - 2 * progress);

      taxi.position.lerpVectors(
        startPosition.current,
        taxiTargetPosition.current,
        easedProgress
      );

      // ===================================================
      // ROTACIÓN FINAL DEL TAXI
      // ===================================================

      taxi.rotation.y =
        Math.PI / 2;

      if (progress >= 1) {
        taxi.position.copy(
          taxiTargetPosition.current
        );

        taxi.rotation.y =
          Math.PI / 2;

        elapsed.current = 0;

        setPhase("waiting");
      }

      return;
    }

    // =====================================================
    // TAXI ESPERA
    // =====================================================

    if (phase === "waiting") {
      if (elapsed.current >= 0.9) {
        elapsed.current = 0;

        setPhase("passenger");
      }

      return;
    }

    // =====================================================
    // PASAJERO CAMINANDO
    // =====================================================

    if (phase === "passenger") {
      return;
    }
  });

  if (!active) {
    return null;
  }

  // =====================================================
  // POSICIÓN INICIAL DEL PASAJERO
  // =====================================================

  const passengerPosition: [
    number,
    number,
    number
  ] = [
    taxiTargetPosition.current.x + 1.25,
    0,
    taxiTargetPosition.current.z,
  ];

  return (
    <>
      {phase === "passenger" && (
        <Passenger
          position={passengerPosition}
          onFinished={() => {
            setPhase("done");

            onFinished?.();
          }}
        />
      )}
    </>
  );
}