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
};

export default function CameraFollow({
  target,
  started,
}: CameraFollowProps) {
  const { camera } = useThree();

  const currentPosition = useRef(
    new THREE.Vector3()
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
    const taxi = target.current;

    if (!taxi) {
      return;
    }

    /*
     * Dirección hacia la que mira el taxi.
     * El taxi utiliza -Z como dirección frontal.
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
     * Vector lateral del taxi.
     *
     * Esto es importante:
     * ya no usamos el eje X global.
     * La cámara se coloca respecto
     * a la orientación actual del taxi.
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
     * Distancia de seguimiento.
     */
    const distance = started
      ? 10
      : 18;

    /*
     * Altura de la cámara.
     */
    const height = started
      ? 4
      : 6;

    /*
     * Posición detrás del taxi.
     */
    targetPosition.current.copy(
      taxi.position
    );

    targetPosition.current.addScaledVector(
      forward.current,
      -distance
    );

    /*
     * Pequeño desplazamiento lateral.
     *
     * Ahora es relativo al taxi.
     * Si el taxi gira, este desplazamiento
     * gira con él.
     */
    targetPosition.current.addScaledVector(
      right.current,
      1
    );

    /*
     * Altura.
     */
    targetPosition.current.y +=
      height;

    /*
     * Suavizado del movimiento.
     */
    const smoothFactor =
      1 - Math.exp(-6 * delta);

    currentPosition.current.lerp(
      targetPosition.current,
      smoothFactor
    );

    /*
     * Aplicamos la posición final.
     */
    camera.position.copy(
      currentPosition.current
    );

    /*
     * La cámara siempre mira al taxi.
     */
    camera.lookAt(
      taxi.position.x,
      taxi.position.y + 1,
      taxi.position.z
    );
  });
}