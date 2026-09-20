"use client";

import {
  useFrame,
  useThree,
} from "@react-three/fiber";

import { useRef } from "react";

import * as THREE from "three";

type CameraFollowProps = {
  target: React.RefObject<
    THREE.Group | null
  >;

  started: boolean;

  intro: boolean;

  finishing?: boolean;

  finished?: boolean;
};

export default function CameraFollow({
  target,
  started,
  intro,
  finishing = false,
  finished = false,
}: CameraFollowProps) {
  const { camera } = useThree();

  const currentPosition = useRef(
    new THREE.Vector3(
      -1,
      4.2,
      82
    )
  );

  const targetPosition = useRef(
    new THREE.Vector3()
  );

  const forward = useRef(
    new THREE.Vector3()
  );

  const right = useRef(
    new THREE.Vector3()
  );

  useFrame((_, delta) => {
    // =====================================================
    // CÁMARA DE INTRO
    // =====================================================

    if (intro) {
      targetPosition.current.set(
        -1,
        4.2,
        82
      );

      const smoothFactor =
        1 - Math.exp(-8 * delta);

      currentPosition.current.lerp(
        targetPosition.current,
        smoothFactor
      );

      camera.position.copy(
        currentPosition.current
      );

      camera.lookAt(
        -1,
        1.5,
        64
      );

      return;
    }

    // =====================================================
    // PLANO FINAL PANORÁMICO
    // =====================================================

    if (
      finishing ||
      finished
    ) {
      targetPosition.current.set(
        -11,
        8,
        23
      );

      const finishTarget =
        new THREE.Vector3(
          0,
          1.3,
          5
        );

      const smoothFactor =
        1 - Math.exp(-2.2 * delta);

      currentPosition.current.lerp(
        targetPosition.current,
        smoothFactor
      );

      camera.position.copy(
        currentPosition.current
      );

      camera.lookAt(
        finishTarget
      );

      return;
    }

    // =====================================================
    // CÁMARA NORMAL SIGUIENDO EL TAXI
    // =====================================================

    const taxi =
      target.current;

    if (!taxi) {
      return;
    }

    forward.current.set(
      0,
      0,
      -1
    );

    forward.current.applyQuaternion(
      taxi.quaternion
    );

    right.current.set(
      1,
      0,
      0
    );

    right.current.applyQuaternion(
      taxi.quaternion
    );

    const distance = 10;

    const height = 4;

    targetPosition.current.copy(
      taxi.position
    );

    targetPosition.current.addScaledVector(
      forward.current,
      -distance
    );

    targetPosition.current.addScaledVector(
      right.current,
      1
    );

    targetPosition.current.y +=
      height;

    const smoothFactor =
      1 - Math.exp(-6 * delta);

    currentPosition.current.lerp(
      targetPosition.current,
      smoothFactor
    );

    camera.position.copy(
      currentPosition.current
    );

    camera.lookAt(
      taxi.position.x,
      taxi.position.y + 1,
      taxi.position.z
    );
  });

  return null;
}