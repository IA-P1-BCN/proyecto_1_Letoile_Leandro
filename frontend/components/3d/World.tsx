"use client";

import Ground from "./Ground";
import Roads from "./roads/Roads";
import City from "./city/City";

export default function World() {
  return (
    <group>
      <Ground />
      <Roads />
      <City />
    </group>
  );
}