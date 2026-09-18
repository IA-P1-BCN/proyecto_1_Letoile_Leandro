"use client";

import RoadSegment from "./RoadSegment";

const ROAD_LENGTH = 4;

type StreetProps = {
  axis: "x" | "z";
  position: number;
  start: number;
  end: number;
};

function Street({
  axis,
  position,
  start,
  end,
}: StreetProps) {
  const segments = [];

  for (
    let coordinate = start;
    coordinate <= end;
    coordinate += ROAD_LENGTH
  ) {
    if (axis === "x") {
      // Calle horizontal: el GLB necesita rotar 90°
      segments.push(
        <RoadSegment
          key={`${axis}-${position}-${coordinate}`}
          position={[coordinate, 0, position]}
          rotation={[0, Math.PI / 2, 0]}
        />
      );
    } else {
      // Calle vertical: orientación original del GLB
      segments.push(
        <RoadSegment
          key={`${axis}-${position}-${coordinate}`}
          position={[position, 0, coordinate]}
          rotation={[0, 0, 0]}
        />
      );
    }
  }

  return <group>{segments}</group>;
}

export default function Roads() {
  return (
    <group>
      {/* ========================= */}
      {/* CALLES HORIZONTALES - X */}
      {/* ========================= */}

      <Street
        axis="x"
        position={-24}
        start={-28}
        end={28}
      />

      <Street
        axis="x"
        position={-8}
        start={-20}
        end={20}
      />

      <Street
        axis="x"
        position={8}
        start={-32}
        end={32}
      />

      <Street
        axis="x"
        position={24}
        start={-16}
        end={28}
      />

      {/* ======================= */}
      {/* CALLES VERTICALES - Z */}
      {/* ======================= */}

      <Street
        axis="z"
        position={-24}
        start={-24}
        end={24}
      />

      <Street
        axis="z"
        position={-8}
        start={-32}
        end={16}
      />

      <Street
        axis="z"
        position={8}
        start={-16}
        end={32}
      />

      <Street
        axis="z"
        position={24}
        start={-28}
        end={12}
      />
    </group>
  );
}