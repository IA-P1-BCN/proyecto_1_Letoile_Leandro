"use client";

export default function Ground() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.02, 0]}
      receiveShadow
    >
      <planeGeometry args={[200, 200]} />

      <meshStandardMaterial
        color="#4f7942"
        roughness={0.9}
        metalness={0}
      />
    </mesh>
  );
}