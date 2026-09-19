"use client";

export default function Sidewalks() {
  const size = 13;

  return (
    <group>
      {/* Base de la manzana */}
      <mesh
        position={[0, 0.04, 0]}
        receiveShadow
      >
        <boxGeometry
          args={[size, 0.08, size]}
        />

        <meshStandardMaterial
          color="#a7a7a7"
          roughness={0.95}
        />
      </mesh>

      {/* Zona verde interior */}
      <mesh
        position={[0, 0.09, 0]}
        receiveShadow
      >
        <boxGeometry
          args={[11.8, 0.04, 11.8]}
        />

        <meshStandardMaterial
          color="#668c55"
          roughness={1}
        />
      </mesh>
    </group>
  );
}