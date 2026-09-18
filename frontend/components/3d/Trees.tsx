"use client";

const trees = [
  [-12, -12],
  [12, -12],
  [-12, 12],
  [12, 12],
  [-42, -12],
  [42, -12],
  [-42, 12],
  [42, 12],
  [-60, -35],
  [60, -35],
  [-60, 35],
  [60, 35],
  [-80, -70],
  [80, -70],
  [-80, 70],
  [80, 70],
];

export default function Trees() {
  return (
    <group>
      {trees.map(([x, z], index) => (
        <group key={index} position={[x, 0, z]}>
          {/* Tronco */}
          <mesh position={[0, 1, 0]}>
            <cylinderGeometry args={[0.35, 0.45, 2, 12]} />
            <meshStandardMaterial color="#6b4423" />
          </mesh>

          {/* Copa */}
          <mesh position={[0, 2.5, 0]}>
            <sphereGeometry args={[1.5, 16, 16]} />
            <meshStandardMaterial color="#2f7d32" />
          </mesh>
        </group>
      ))}
    </group>
  );
}