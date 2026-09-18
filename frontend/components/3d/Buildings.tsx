"use client";

const buildings = [
  { position: [-18, 3, -18], size: [8, 6, 8] },
  { position: [18, 4, -18], size: [7, 8, 7] },
  { position: [-18, 2.5, 18], size: [9, 5, 7] },
  { position: [18, 3, 18], size: [8, 6, 9] },

  { position: [-45, 4, -25], size: [10, 8, 10] },
  { position: [45, 3, -25], size: [8, 6, 8] },
  { position: [-45, 3, 25], size: [8, 6, 10] },
  { position: [45, 4, 25], size: [10, 8, 8] },

  { position: [-65, 2.5, -60], size: [9, 5, 9] },
  { position: [65, 3, -60], size: [8, 6, 8] },
  { position: [-65, 4, 60], size: [10, 8, 10] },
  { position: [65, 2.5, 60], size: [9, 5, 9] },
];

export default function Buildings() {
  return (
    <group>
      {buildings.map((building, index) => (
        <mesh
          key={index}
          position={[
            building.position[0],
            building.position[1],
            building.position[2],
          ]}
        >
          <boxGeometry args={building.size as [number, number, number]} />
          <meshStandardMaterial color="#8a8a8a" />
        </mesh>
      ))}
    </group>
  );
}