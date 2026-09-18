"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type CameraFollowProps = {
  target: React.RefObject<THREE.Group | null>;
};

export default function CameraFollow({
  target,
}: CameraFollowProps) {
  const { camera } = useThree();

  const currentPosition = useRef(
    new THREE.Vector3(12, 10, 16)
  );

  useFrame(() => {
    if (!target.current) return;

    const taxi = target.current;

    const offset = new THREE.Vector3(
      0,
      6,
      8
    );

    offset.applyQuaternion(taxi.quaternion);

    const desiredPosition = new THREE.Vector3()
      .copy(taxi.position)
      .add(offset);

    currentPosition.current.lerp(
      desiredPosition,
      0.08
    );

    camera.position.copy(
      currentPosition.current
    );

    const lookAt = new THREE.Vector3(
      taxi.position.x,
      taxi.position.y + 1,
      taxi.position.z
    );

    camera.lookAt(lookAt);
  });

  return null;
}