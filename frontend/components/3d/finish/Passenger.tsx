"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type PassengerProps = {
  position: [number, number, number];
  onFinished?: () => void;
};

export default function Passenger({
  position,
  onFinished,
}: PassengerProps) {
  const groupRef =
    useRef<THREE.Group>(null);

  const elapsed = useRef(0);

  const finished = useRef(false);

  // =====================================================
  // POSICIÓN INICIAL
  //
  // El pasajero aparece directamente aquí.
  // Es el antiguo "sidePoint", que visualmente
  // ya estaba bien colocado.
  // =====================================================

  const startPosition = useRef(
    new THREE.Vector3(
      3.5,
      0,
      6.2
    )
  );

  // =====================================================
  // DESTINO
  //
  // Entrada del edificio
  // =====================================================

  const doorPoint = useRef(
    new THREE.Vector3(
      0,
      0,
      3.15
    )
  );

  // =====================================================
  // MOVIMIENTO
  // =====================================================

  useFrame((_, delta) => {
    const group =
      groupRef.current;

    if (
      !group ||
      finished.current
    ) {
      return;
    }

    elapsed.current += delta;

    // ===================================================
    // ESPERA ANTES DE CAMINAR
    // ===================================================

    const waitDuration = 1.0;

    if (
      elapsed.current <
      waitDuration
    ) {
      group.position.copy(
        startPosition.current
      );

      return;
    }

    // ===================================================
    // CAMINATA HACIA LA PUERTA
    // ===================================================

    const walkElapsed =
      elapsed.current -
      waitDuration;

    const walkDuration = 2.8;

    const progress = Math.min(
      walkElapsed /
        walkDuration,
      1
    );

    const easedProgress =
      progress *
      progress *
      (3 - 2 * progress);

    group.position.lerpVectors(
      startPosition.current,
      doorPoint.current,
      easedProgress
    );

    // ===================================================
    // PEQUEÑO MOVIMIENTO AL CAMINAR
    // ===================================================

    const walking =
      progress > 0 &&
      progress < 1;

    if (walking) {
      const bounce =
        Math.abs(
          Math.sin(
            elapsed.current * 10
          )
        ) * 0.035;

      group.position.y =
        bounce;
    }

    // ===================================================
    // ORIENTACIÓN
    // =====================================================

    const direction =
      new THREE.Vector3()
        .subVectors(
          doorPoint.current,
          group.position
        );

    direction.y = 0;

    if (
      direction.lengthSq() >
      0.001
    ) {
      direction.normalize();

      const angle =
        Math.atan2(
          direction.x,
          direction.z
        );

      group.rotation.y =
        angle;
    }

    // ===================================================
    // LLEGÓ A LA PUERTA
    // =====================================================

    if (progress >= 1) {
      finished.current = true;

      group.position.copy(
        doorPoint.current
      );

      group.position.y = 0;

      onFinished?.();
    }
  });

  return (
    <group
      ref={groupRef}
      position={[
        3.5,
        0,
        6.2,
      ]}
    >
      {/* ===============================================
          CUERPO
      =============================================== */}

      <mesh
        position={[
          0,
          0.9,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.42,
            0.9,
            0.28,
          ]}
        />

        <meshStandardMaterial
          color="#2f4050"
          roughness={0.7}
        />
      </mesh>

      {/* ===============================================
          CABEZA
      =============================================== */}

      <mesh
        position={[
          0,
          1.55,
          0,
        ]}
      >
        <sphereGeometry
          args={[
            0.24,
            12,
            12,
          ]}
        />

        <meshStandardMaterial
          color="#d9a066"
          roughness={0.8}
        />
      </mesh>

      {/* ===============================================
          BRAZO IZQUIERDO
      =============================================== */}

      <mesh
        position={[
          -0.3,
          0.95,
          0,
        ]}
        rotation={[
          0,
          0,
          -0.15,
        ]}
      >
        <boxGeometry
          args={[
            0.12,
            0.65,
            0.12,
          ]}
        />

        <meshStandardMaterial
          color="#2f4050"
          roughness={0.7}
        />
      </mesh>

      {/* ===============================================
          BRAZO DERECHO
      =============================================== */}

      <mesh
        position={[
          0.3,
          0.95,
          0,
        ]}
        rotation={[
          0,
          0,
          0.15,
        ]}
      >
        <boxGeometry
          args={[
            0.12,
            0.65,
            0.12,
          ]}
        />

        <meshStandardMaterial
          color="#2f4050"
          roughness={0.7}
        />
      </mesh>

      {/* ===============================================
          PIERNA IZQUIERDA
      =============================================== */}

      <mesh
        position={[
          -0.11,
          0.3,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.14,
            0.65,
            0.14,
          ]}
        />

        <meshStandardMaterial
          color="#151a20"
          roughness={0.8}
        />
      </mesh>

      {/* ===============================================
          PIERNA DERECHA
      =============================================== */}

      <mesh
        position={[
          0.11,
          0.3,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.14,
            0.65,
            0.14,
          ]}
        />

        <meshStandardMaterial
          color="#151a20"
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}