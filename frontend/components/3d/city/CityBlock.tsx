"use client";

import Buildings from "./Buildings";
import Trees from "./Trees";
import Sidewalks from "./Sidewalks";

type CityBlockProps = {
  position: [number, number, number];
};

export default function CityBlock({
  position,
}: CityBlockProps) {
  return (
    <group position={position}>
      <Sidewalks />
      <Buildings />
      <Trees />
    </group>
  );
}