"use client";

function Road({
  position,
  rotation = [0, 0, 0],
  size,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number];
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshStandardMaterial color="#303030" />
    </mesh>
  );
}

function RoadLine({
  position,
  rotation = [0, 0, 0],
  size,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number];
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshStandardMaterial color="#e8e8e8" />
    </mesh>
  );
}

export default function Roads() {
  return (
    <group>
      {/* Carretera horizontal principal */}
      <Road
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        size={[200, 8]}
      />

      {/* Carretera vertical principal */}
      <Road
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        size={[200, 8]}
      />

      {/* Carretera horizontal secundaria */}
      <Road
        position={[0, 0, 30]}
        rotation={[-Math.PI / 2, 0, 0]}
        size={[200, 6]}
      />

      {/* Carretera vertical secundaria */}
      <Road
        position={[30, 0, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        size={[200, 6]}
      />

      {/* Línea central horizontal */}
      <RoadLine
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        size={[200, 0.15]}
      />

      {/* Línea central vertical */}
      <RoadLine
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        size={[200, 0.15]}
      />

      {/* Línea secundaria horizontal */}
      <RoadLine
        position={[0, 0.01, 30]}
        rotation={[-Math.PI / 2, 0, 0]}
        size={[200, 0.1]}
      />

      {/* Línea secundaria vertical */}
      <RoadLine
        position={[30, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        size={[200, 0.1]}
      />
    </group>
  );
}