"use client";

import RoadSegment from "./RoadSegment";

const ROAD_LENGTH = 4;

const ROAD_POSITIONS = [-8, 8];

const CITY_START = -60;
const CITY_END = 60;

type StreetProps = {
  axis: "x" | "z";
  position: number;
};

function Street({
  axis,
  position,
}: StreetProps) {
  const segments = [];

  for (
    let coordinate = CITY_START;
    coordinate <= CITY_END;
    coordinate += ROAD_LENGTH
  ) {
    if (axis === "x") {
      segments.push(
        <RoadSegment
          key={`${axis}-${position}-${coordinate}`}
          position={[
            coordinate,
            0,
            position,
          ]}
          rotation={[0, Math.PI / 2, 0]}
        />
      );
    } else {
      segments.push(
        <RoadSegment
          key={`${axis}-${position}-${coordinate}`}
          position={[
            position,
            0,
            coordinate,
          ]}
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
      {ROAD_POSITIONS.map((position) => (
        <Street
          key={`horizontal-${position}`}
          axis="x"
          position={position}
        />
      ))}

      {ROAD_POSITIONS.map((position) => (
        <Street
          key={`vertical-${position}`}
          axis="z"
          position={position}
        />
      ))}
    </group>
  );
}