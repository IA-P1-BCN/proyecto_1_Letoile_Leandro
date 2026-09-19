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
      <mesh
        position={[0, 0.9, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry
          args={[0.22, 0.3, 1.8, 8]}
        />

        <meshStandardMaterial
          color="#654321"
          roughness={1}
        />
      </mesh>

      {variant === "round" ? (
        <>
          {/* Copa inferior */}
          <mesh
            position={[0, 2.1, 0]}
            castShadow
          >
            <sphereGeometry
              args={[1.15, 12, 10]}
            />

            <meshStandardMaterial
              color="#347a3c"
              roughness={1}
            />
          </mesh>

          {/* Copa superior */}
          <mesh
            position={[0, 2.8, 0]}
            castShadow
          >
            <sphereGeometry
              args={[0.85, 12, 10]}
            />

            <meshStandardMaterial
              color="#3f9148"
              roughness={1}
            />
          </mesh>
        </>
      ) : (
        <>
          {/* Pino inferior */}
          <mesh
            position={[0, 2, 0]}
            castShadow
          >
            <coneGeometry
              args={[1.1, 2, 10]}
            />

            <meshStandardMaterial
              color="#2f6f38"
              roughness={1}
            />
          </mesh>

          {/* Pino superior */}
          <mesh
            position={[0, 3, 0]}
            castShadow
          >
            <coneGeometry
              args={[0.75, 1.8, 10]}
            />

            <meshStandardMaterial
              color="#3c8744"
              roughness={1}
            />
          </mesh>
        </>
      )}
    </group>
  );
}