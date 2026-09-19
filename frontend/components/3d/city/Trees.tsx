"use client";

import Tree from "./Tree";

type TreeData = {
  position: [number, number, number];
  scale: number;
  variant: "round" | "pine";
};

const trees: TreeData[] = [
  {
    position: [-5.3, 0, -5],
    scale: 0.9,
    variant: "round",
  },
  {
    position: [5.1, 0, -5],
    scale: 1,
    variant: "round",
  },
  {
    position: [-5.2, 0, 5],
    scale: 0.85,
    variant: "pine",
  },
  {
    position: [5.2, 0, 5],
    scale: 0.95,
    variant: "round",
  },
  {
    position: [0, 0, -5.5],
    scale: 0.75,
    variant: "pine",
  },
  {
    position: [0, 0, 5.5],
    scale: 0.8,
    variant: "round",
  },
];

export default function Trees() {
  return (
    <group>
      {trees.map((tree, index) => (
        <Tree
          key={index}
          position={tree.position}
          scale={tree.scale}
          variant={tree.variant}
        />
      ))}
    </group>
  );
}