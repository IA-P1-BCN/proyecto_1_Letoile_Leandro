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
};

export default function CameraFollow({
  target,
  started,
  intro,
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
    /*
     * ESTADO INICIAL
     *
     * La cámara permanece detrás de la posición
     * original del taxi y mira hacia el cartel.
     *
     * Se acerca un poco respecto a la versión anterior.
     */
    if (intro) {
      targetPosition.current.set(
        -1,
        4.2,
        82
      );

      const smoothFactor =
        1 - Math.exp(
          -8 * delta
        );

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

    const taxi = target.current;

    if (!taxi) {
      return;
    }

    /*
     * DIRECCIÓN DEL TAXI
     */
    forward.current.set(
      0,
      0,
      -1
    );

    forward.current.applyQuaternion(
      taxi.quaternion
    );

    /*
     * LATERAL DEL TAXI
     */
    right.current.set(
      1,
      0,
      0
    );

    right.current.applyQuaternion(
      taxi.quaternion
    );

    /*
     * DISTANCIA DE LA CÁMARA
     */
    const distance = 10;
    const height = 4;

    targetPosition.current.copy(
      taxi.position
    );

    /*
     * Nos colocamos detrás del taxi.
     */
    targetPosition.current.addScaledVector(
      forward.current,
      -distance
    );

    /*
     * Pequeño desplazamiento lateral.
     */
    targetPosition.current.addScaledVector(
      right.current,
      1
    );

    targetPosition.current.y +=
      height;

    /*
     * Suavizado del seguimiento.
     */
    const smoothFactor =
      1 - Math.exp(
        -6 * delta
      );

    currentPosition.current.lerp(
      targetPosition.current,
      smoothFactor
    );

    camera.position.copy(
      currentPosition.current
    );

    /*
     * La cámara mira ligeramente por encima
     * del centro del taxi.
     */
    camera.lookAt(
      taxi.position.x,
      taxi.position.y + 1,
      taxi.position.z
    );
  });
}