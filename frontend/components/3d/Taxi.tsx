"use client";

import { useFrame } from "@react-three/fiber";
import { forwardRef, useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

import type { TaxiControlsState } from "./controls/TaxiControls";

export type VehicleStatus = "stopped" | "moving";

type TaxiProps = {
  controls: React.RefObject<TaxiControlsState | null>;
  tripActive: boolean;
  onSpeedChange?: (speed: number) => void;
  onVehicleStatusChange?: (
    status: VehicleStatus
  ) => void;
};

const Taxi = forwardRef<THREE.Group, TaxiProps>(
  (
    {
      controls,
      tripActive,
      onSpeedChange,
      onVehicleStatusChange,
    },
    ref
  ) => {
    const speed = useRef(0);

    const lastReportedSpeed = useRef(0);

    const lastVehicleStatus =
      useRef<VehicleStatus>("stopped");

    const maxSpeed = 12;
    const acceleration = 8;
    const braking = 18;
    const friction = 4;
    const rotationSpeed = 2;

    const { scene } = useGLTF(
      "/models/taxi/taxi.glb"
    );

    useFrame((_, delta) => {
      const taxi =
        ref && "current" in ref
          ? ref.current
          : null;

      if (!taxi) {
        return;
      }

      const input = controls.current;

      /*
       * Si no hay un viaje activo,
       * el taxi permanece detenido.
       */
      if (!tripActive) {
        speed.current = 0;

        if (lastReportedSpeed.current !== 0) {
          lastReportedSpeed.current = 0;
          onSpeedChange?.(0);
        }

        if (
          lastVehicleStatus.current !==
          "stopped"
        ) {
          lastVehicleStatus.current =
            "stopped";

          onVehicleStatusChange?.(
            "stopped"
          );
        }

        return;
      }

      /*
       * ACELERACIÓN
       *
       * ArrowUp aumenta la velocidad.
       */
      if (input.forward && !input.brake) {
        speed.current +=
          acceleration * delta;
      }

      /*
       * FRENO
       *
       * ArrowDown reduce la velocidad.
       * Nunca permite velocidad negativa.
       */
      if (input.brake) {
        speed.current = Math.max(
          0,
          speed.current -
            braking * delta
        );
      }

      /*
       * FRICCIÓN
       *
       * Si soltamos ArrowUp y no estamos
       * frenando, el taxi sigue avanzando
       * pero pierde velocidad gradualmente.
       */
      if (
        !input.forward &&
        !input.brake
      ) {
        speed.current = Math.max(
          0,
          speed.current -
            friction * delta
        );
      }

      /*
       * Limitar velocidad.
       */
      speed.current =
        THREE.MathUtils.clamp(
          speed.current,
          0,
          maxSpeed
        );

      /*
       * Informar cambios de velocidad.
       *
       * Cuando llega exactamente a 0,
       * también notificamos el cambio.
       */
      if (
        speed.current === 0 ||
        Math.abs(
          speed.current -
            lastReportedSpeed.current
        ) > 0.1
      ) {
        lastReportedSpeed.current =
          speed.current;

        onSpeedChange?.(
          speed.current
        );
      }

      /*
       * ESTADO REAL DEL VEHÍCULO
       *
       * No depende de ArrowUp.
       * Depende de la velocidad real.
       */
      const currentVehicleStatus: VehicleStatus =
        speed.current > 0.1
          ? "moving"
          : "stopped";

      /*
       * Solo notificamos cuando
       * realmente cambia el estado.
       */
      if (
        currentVehicleStatus !==
        lastVehicleStatus.current
      ) {
        lastVehicleStatus.current =
          currentVehicleStatus;

        onVehicleStatusChange?.(
          currentVehicleStatus
        );
      }

      /*
       * GIRO
       *
       * Solo gira cuando el taxi
       * está realmente en movimiento.
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
       * MOVIMIENTO
       */
      if (speed.current > 0) {
        const forward =
          new THREE.Vector3(
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

useGLTF.preload(
  "/models/taxi/taxi.glb"
);

export default Taxi;