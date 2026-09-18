"use client";

import Ground from "./Ground";
import Roads from "./Roads";
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