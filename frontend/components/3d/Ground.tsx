"use client";

import { useTexture } from "@react-three/drei";

export default function Ground() {
  const spaceTexture = useTexture(
    "/textures/space.svg"
  );

  return (
    <group>
      {/* Espacio / galaxia debajo de la ciudad */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -8, 0]}
      >
        <planeGeometry args={[320, 320]} />

        <meshBasicMaterial
          map={spaceTexture}
          transparent
          opacity={1}
          depthWrite={false}
        />
      </mesh>

      {/* Piso transparente */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
      >
        <planeGeometry args={[160, 160]} />

        <meshBasicMaterial
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* Grid principal */}
      <gridHelper
        args={[
          160,
          80,
          "#31536a",
          "#182b3a",
        ]}
        position={[0, 0.01, 0]}
      />

      {/* Grid secundario */}
      <gridHelper
        args={[
          160,
          16,
          "#203b4e",
          "#0d1b27",
        ]}
        position={[0, 0.015, 0]}
      />

      {/* Línea central X */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
      >
        <planeGeometry args={[0.04, 160]} />

        <meshBasicMaterial
          color="#315d73"
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Línea central Z */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.021, 0]}
      >
        <planeGeometry args={[160, 0.04]} />

        <meshBasicMaterial
          color="#315d73"
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Centro del grid */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.025, 0]}
      >
        <planeGeometry args={[0.8, 0.8]} />

        <meshBasicMaterial
          color="#173449"
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}