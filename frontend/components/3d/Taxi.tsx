"use client";

import { useFrame } from "@react-three/fiber";
import { forwardRef, useRef } from "react";
import * as THREE from "three";
import useTaxiControls from "./controls/TaxiControls";

const Taxi = forwardRef<THREE.Group>((_, ref) => {
  const controls = useTaxiControls();

  const speed = useRef(0);

  const maxSpeed = 12;
  const acceleration = 8;
  const braking = 12;
  const friction = 4;
  const rotationSpeed = 2;

  useFrame((_, delta) => {
    const taxi = ref && "current" in ref ? ref.current : null;

    if (!taxi) return;

    const input = controls.current;

    // --------------------------------
    // ACELERACIÓN
    // --------------------------------

    if (input.forward) {
      speed.current += acceleration * delta;
    }

    // --------------------------------
    // REVERSA / FRENO
    // --------------------------------

    if (input.backward) {
      speed.current -= braking * delta;
    }

    // --------------------------------
    // FRICCIÓN
    // --------------------------------

    if (!input.forward && !input.backward) {
      if (speed.current > 0) {
        speed.current = Math.max(
          0,
          speed.current - friction * delta
        );
      }

      if (speed.current < 0) {
        speed.current = Math.min(
          0,
          speed.current + friction * delta
        );
      }
    }

    // --------------------------------
    // LIMITAR VELOCIDAD
    // --------------------------------

    speed.current = THREE.MathUtils.clamp(
      speed.current,
      -5,
      maxSpeed
    );

    // --------------------------------
    // DIRECCIÓN
    // --------------------------------

    if (Math.abs(speed.current) > 0.1) {
      const direction = speed.current >= 0 ? 1 : -1;

      if (input.left) {
        taxi.rotation.y +=
          rotationSpeed * delta * direction;
      }

      if (input.right) {
        taxi.rotation.y -=
          rotationSpeed * delta * direction;
      }
    }

    // --------------------------------
    // MOVIMIENTO
    // --------------------------------

    const forward = new THREE.Vector3(0, 0, -1);

    forward.applyQuaternion(taxi.quaternion);

    taxi.position.addScaledVector(
      forward,
      speed.current * delta
    );
  });

  return (
    <group ref={ref}>
      {/* Carrocería */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[3, 0.8, 5]} />
        <meshStandardMaterial color="#f5c400" />
      </mesh>

      {/* Parte superior / habitáculo */}
      <mesh position={[0, 1.35, 0.3]}>
        <boxGeometry args={[2.4, 0.7, 2.5]} />
        <meshStandardMaterial color="#f5c400" />
      </mesh>

      {/* Techo */}
      <mesh position={[0, 1.75, 0.3]}>
        <boxGeometry args={[2.2, 0.15, 2.3]} />
        <meshStandardMaterial color="#f5c400" />
      </mesh>

      {/* Cartel TAXI */}
      <mesh position={[0, 1.95, 0.3]}>
        <boxGeometry args={[0.9, 0.25, 0.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Rueda delantera izquierda */}
      <mesh
        position={[-1.55, 0.45, -1.5]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.5, 0.5, 0.35, 32]} />
        <meshStandardMaterial color="#151515" />
      </mesh>

      {/* Rueda delantera derecha */}
      <mesh
        position={[1.55, 0.45, -1.5]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.5, 0.5, 0.35, 32]} />
        <meshStandardMaterial color="#151515" />
      </mesh>

      {/* Rueda trasera izquierda */}
      <mesh
        position={[-1.55, 0.45, 1.5]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.5, 0.5, 0.35, 32]} />
        <meshStandardMaterial color="#151515" />
      </mesh>

      {/* Rueda trasera derecha */}
      <mesh
        position={[1.55, 0.45, 1.5]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.5, 0.5, 0.35, 32]} />
        <meshStandardMaterial color="#151515" />
      </mesh>
    </group>
  );
});

Taxi.displayName = "Taxi";

export default Taxi;