"use client";

type TreeProps = {
  position?: [number, number, number];
  scale?: number;
  variant?: "round" | "pine";
};

export default function Tree({
  position = [0, 0, 0],
  scale = 1,
  variant = "round",
}: TreeProps) {
  return (
    <group
      position={position}
      scale={scale}
    >
      {/* Tronco */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry
          args={[
            0.22,
            0.3,
            1.8,
            8,
          ]}
        />

        <meshStandardMaterial
          color="#38251a"
          roughness={0.35}
          metalness={0.2}
          transparent
          opacity={0.82}
        />
      </mesh>

      {variant === "round" ? (
        <>
          {/* Copa inferior */}
          <mesh position={[0, 2.1, 0]}>
            <sphereGeometry
              args={[
                1.15,
                12,
                10,
              ]}
            />

            <meshStandardMaterial
              color="#205238"
              roughness={0.3}
              metalness={0.25}
              transparent
              opacity={0.72}
              emissive="#102b1d"
              emissiveIntensity={0.15}
            />
          </mesh>

          {/* Copa superior */}
          <mesh position={[0, 2.8, 0]}>
            <sphereGeometry
              args={[
                0.85,
                12,
                10,
              ]}
            />

            <meshStandardMaterial
              color="#286344"
              roughness={0.3}
              metalness={0.25}
              transparent
              opacity={0.68}
              emissive="#123321"
              emissiveIntensity={0.15}
            />
          </mesh>
        </>
      ) : (
        <>
          {/* Pino inferior */}
          <mesh position={[0, 2, 0]}>
            <coneGeometry
              args={[
                1.1,
                2,
                10,
              ]}
            />

            <meshStandardMaterial
              color="#1c4b32"
              roughness={0.3}
              metalness={0.25}
              transparent
              opacity={0.72}
              emissive="#0d291b"
              emissiveIntensity={0.15}
            />
          </mesh>

          {/* Pino superior */}
          <mesh position={[0, 3, 0]}>
            <coneGeometry
              args={[
                0.75,
                1.8,
                10,
              ]}
            />

            <meshStandardMaterial
              color="#245a3b"
              roughness={0.3}
              metalness={0.25}
              transparent
              opacity={0.68}
              emissive="#102e1e"
              emissiveIntensity={0.15}
            />
          </mesh>
        </>
      )}
    </group>
  );
}