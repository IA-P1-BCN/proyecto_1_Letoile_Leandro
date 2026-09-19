"use client";

import CityBlock from "./CityBlock";

const BLOCK_CENTERS = [-32, -16, 0, 16, 32];

export default function City() {
  return (
    <group>
      {BLOCK_CENTERS.map((x) =>
        BLOCK_CENTERS.map((z) => (
          <CityBlock
            key={`${x}-${z}`}
            position={[x, 0, z]}
          />
        ))
      )}
    </group>
  );
}