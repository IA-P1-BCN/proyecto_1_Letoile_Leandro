"use client";

import Ground from "./Ground";
import Roads from "./roads/Roads";
import Buildings from "./Buildings";
import Trees from "./Trees";

export default function World() {
  return (
    <group>
      <Ground />

      <Roads />

      <Buildings />

      <Trees />
    </group>
  );
}