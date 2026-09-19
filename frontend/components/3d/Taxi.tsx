"use client";

import { useFrame } from "@react-three/fiber";
import { forwardRef, useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

import type { TaxiControlsState } from "./controls/TaxiControls";

type TaxiProps = {
  controls: React.RefObject<TaxiControlsState | null>;
  tripActive: boolean;
  onSpeedChange?: (speed: number) => void;
};

const Taxi = forwardRef<THREE.Group, TaxiProps>(
  ({ controls, tripActive, onSpeedChange }, ref) => {
    const speed = useRef(0);
    const lastReportedSpeed = useRef(0);

    const maxSpeed = 12;
    const acceleration = 8;
    const braking = 18;
    const friction = 4;
    const rotationSpeed = 2;

    const { scene } = useGLTF("/models/taxi/taxi.glb");

    useFrame((_, delta) => {
      const taxi =
        ref && "current" in ref ? ref.current : null;

      if (!taxi) return;

      const input = controls.current;

      /*
       * ==================================================
       * VIAJE INACTIVO
       * ==================================================
       */

      if (!tripActive) {
        speed.current = 0;

        if (lastReportedSpeed.current !== 0) {
          lastReportedSpeed.current = 0;
          onSpeedChange?.(0);
        }

        return;
      }

      /*
       * ==================================================
       * ACELERACIÓN
       * ==================================================
       */

      if (input.forward && !input.brake) {
        speed.current += acceleration * delta;
      }

      /*
       * ==================================================
       * FRENADO
       * ==================================================
       */

      if (input.brake) {
        speed.current = Math.max(
          0,
          speed.current - braking * delta
        );
      }

      /*
       * ==================================================
       * FRICCIÓN
       * ==================================================
       */

      if (!input.forward && !input.brake) {
        speed.current = Math.max(
          0,
          speed.current - friction * delta
        );
      }

      /*
       * ==================================================
       * LIMITAR VELOCIDAD
       * ==================================================
       *
       * Nunca permitimos velocidad negativa.
       */

      speed.current = THREE.MathUtils.clamp(
        speed.current,
        0,
        maxSpeed
      );

      /*
       * ==================================================
       * REPORTAR VELOCIDAD
       * ==================================================
       */

      if (
        Math.abs(
          speed.current - lastReportedSpeed.current
        ) > 0.1
      ) {
        lastReportedSpeed.current = speed.current;
        onSpeedChange?.(speed.current);
      }

      /*
       * ==================================================
       * DIRECCIÓN
       * ==================================================
       */

      if (speed.current > 0.1) {
        if (input.left) {
          taxi.rotation.y +=
            rotationSpeed * delta;
        }

        if (input.right) {
          taxi.rotation.y -=
            rotationSpeed * delta;
        }
      }

      /*
       * ==================================================
       * MOVIMIENTO
       * ==================================================
       */

      if (speed.current > 0) {
        const forward = new THREE.Vector3(
          0,
          0,
          -1
        );

        forward.applyQuaternion(
          taxi.quaternion
        );

        taxi.position.addScaledVector(
          forward,
          speed.current * delta
        );
      }
    });

    return (
      <group
        ref={ref}
        position={[0, 0, 48]}
      >
        <primitive
          object={scene}
          scale={1.5}
        />
      </group>
    );
  }
);

Taxi.displayName = "Taxi";

useGLTF.preload("/models/taxi/taxi.glb");

export default Taxi;