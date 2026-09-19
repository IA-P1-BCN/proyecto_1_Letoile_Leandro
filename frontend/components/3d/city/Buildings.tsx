"use client";

import Building from "./Building";

type BuildingData = {
  position: [number, number, number];
  width: number;
  depth: number;
  height: number;
  color: string;
};

const buildings: BuildingData[] = [
  {
    position: [-3.5, 0, -3],
    width: 4,
    depth: 3.5,
    height: 7,
    color: "#858b94",
  },
  {
    position: [2.5, 0, -3],
    width: 3.5,
    depth: 3,
    height: 10,
    color: "#9b8f83",
  },
  {
    position: [-3, 0, 2.5],
    width: 4,
    depth: 3.5,
    height: 5.5,
    color: "#777f89",
  },
  {
    position: [2.8, 0, 2.5],
    width: 3.5,
    depth: 3.5,
    height: 8,
    color: "#a29a91",
  },
];

export default function Buildings() {
  return (
    <group>
      {buildings.map((building, index) => (
        <Building
          key={index}
          position={building.position}
          width={building.width}
          depth={building.depth}
          height={building.height}
          color={building.color}
        />
      ))}
    </group>
  );
}