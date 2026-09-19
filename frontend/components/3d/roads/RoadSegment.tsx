"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";

type RoadSegmentProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
};

export default function RoadSegment({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: RoadSegmentProps) {
  const { scene } = useGLTF(
    "/models/road/road.glb"
  );

  const clonedScene = useMemo(
    () => scene.clone(),
    [scene]
  );

  return (
    <primitive
      object={clonedScene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

useGLTF.preload(
  "/models/road/road.glb"
);