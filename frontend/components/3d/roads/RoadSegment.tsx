"use client";

import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

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
  const { scene } = useGLTF("/models/road/road.glb");

  const clonedScene = scene.clone();

  return (
    <primitive
      object={clonedScene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

useGLTF.preload("/models/road/road.glb");