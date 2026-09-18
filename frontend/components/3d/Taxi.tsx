"use client";

import { useFrame } from "@react-three/fiber";
import { forwardRef, useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

import useTaxiControls from "./controls/TaxiControls";

const Taxi = forwardRef<THREE.Group>((_, ref) => {
  const controls = useTaxiControls();

  const speed = useRef(0);

  const maxSpeed = 12;
  const acceleration = 8;
  const braking = 12;
  const friction = 4;
  const rotationSpeed = 2;

  const { scene } = useGLTF("/models/taxi/taxi.glb");

  useFrame((_, delta) => {
    const taxi = ref && "current" in ref ? ref.current : null;

    if (!taxi) return;

    const input = controls.current;

    if (input.forward) {
      speed.current += acceleration * delta;
    }

    if (input.backward) {
      speed.current -= braking * delta;
    }

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

    speed.current = THREE.MathUtils.clamp(
      speed.current,
      -5,
      maxSpeed
    );

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

    const forward = new THREE.Vector3(0, 0, -1);

    forward.applyQuaternion(taxi.quaternion);

    taxi.position.addScaledVector(
      forward,
      speed.current * delta
    );
  });

  return (
    <group ref={ref}>
      <primitive
        object={scene}
        scale={1.5}
      />
    </group>
  );
});

Taxi.displayName = "Taxi";

useGLTF.preload("/models/taxi/taxi.glb");

export default Taxi;