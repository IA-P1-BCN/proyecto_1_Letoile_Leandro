"use client";

import CityBlock from "./CityBlock";

const CITY_BLOCKS: [number, number, number][] = [
  [0, 0, 0],       // Centro
  [0, 0, -32],     // Arriba
  [0, 0, 32],      // Abajo
  [-32, 0, 0],     // Izquierda
  [32, 0, 0],      // Derecha
];

export default function City() {
  return (
    <group>
      {CITY_BLOCKS.map((position, index) => (
        <CityBlock
          key={index}
          position={position}
        />
      ))}
    </group>
  );
}