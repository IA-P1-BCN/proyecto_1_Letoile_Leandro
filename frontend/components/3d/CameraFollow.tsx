"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type CameraFollowProps = {
  target: React.RefObject<THREE.Group | null>;
  started: boolean;
};

export default function CameraFollow({
  target,
  started,
}: CameraFollowProps) {
  const { camera } = useThree();

  const currentPosition = useRef(
    new THREE.Vector3(0, 6, 59)
  );

  useFrame(() => {
    if (!target.current) {
      return;
    }

    const taxi = target.current;

    let desiredPosition: THREE.Vector3;
    let lookAt: THREE.Vector3;

    /*
     * =====================================================
     * ESTADO INICIAL
     * =====================================================
     *
     * La cámara se mantiene cerca del taxi antes de iniciar
     * el viaje, mostrando mejor el vehículo y el entorno.
     */

    if (!started) {
      desiredPosition = new THREE.Vector3(
        taxi.position.x,
        taxi.position.y + 5.5,
        taxi.position.z + 11
      );

      lookAt = new THREE.Vector3(
        taxi.position.x,
        taxi.position.y + 2,
        taxi.position.z - 5
      );
    }

    /*
     * =====================================================
     * DURANTE EL VIAJE
     * =====================================================
     *
     * Cámara en tercera persona siguiendo al taxi.
     */

    else {
      const offset = new THREE.Vector3(
        0,
        3.8,
        6.5
      );

      offset.applyQuaternion(
        taxi.quaternion
      );

      desiredPosition = new THREE.Vector3()
        .copy(taxi.position)
        .add(offset);

      const forward = new THREE.Vector3(
        0,
        0,
        -1
      );

      forward.applyQuaternion(
        taxi.quaternion
      );

      lookAt = new THREE.Vector3()
        .copy(taxi.position)
        .add(
          forward.multiplyScalar(8)
        );

      lookAt.y += 1.8;
    }

    /*
     * =====================================================
     * SUAVIZADO
     * =====================================================
     */

    const cameraSpeed = started
      ? 0.07
      : 0.08;

    currentPosition.current.lerp(
      desiredPosition,
      cameraSpeed
    );

    camera.position.copy(
      currentPosition.current
    );

    camera.lookAt(lookAt);
  });

  return null;
}