"use client";

import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";

type StartInstructionsProps = {
  visible?: boolean;
};

type ArrowKeyProps = {
  position: [number, number, number];
  direction: "up" | "down" | "left" | "right";
  color: string;
};

function ArrowKey({
  position,
  direction,
  color,
}: ArrowKeyProps) {
  const shape = new THREE.Shape();

  shape.moveTo(0, 0.42);
  shape.lineTo(-0.38, 0.05);
  shape.lineTo(-0.17, 0.05);
  shape.lineTo(-0.17, -0.38);
  shape.lineTo(0.17, -0.38);
  shape.lineTo(0.17, 0.05);
  shape.lineTo(0.38, 0.05);
  shape.closePath();

  const geometry = new THREE.ShapeGeometry(shape);

  let rotation = 0;

  if (direction === "down") {
    rotation = Math.PI;
  }

  if (direction === "left") {
    rotation = Math.PI / 2;
  }

  if (direction === "right") {
    rotation = -Math.PI / 2;
  }

  return (
    <group position={position}>
      <RoundedBox
        args={[1.62, 1.2, 0.12]}
        radius={0.23}
        smoothness={6}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.55}
          metalness={0.15}
        />
      </RoundedBox>

      <RoundedBox
        args={[1.44, 1.02, 0.04]}
        radius={0.18}
        smoothness={6}
        position={[0, 0, 0.08]}
      >
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.14}
          roughness={0.7}
        />
      </RoundedBox>

      <mesh
        geometry={geometry}
        rotation={[0, 0, rotation]}
        position={[0, 0, 0.14]}
        scale={1.15}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

type CommandKeyProps = {
  position: [number, number, number];
  label: string;
  color: string;
  width?: number;
};

function CommandKey({
  position,
  label,
  color,
  width = 2.75,
}: CommandKeyProps) {
  return (
    <group position={position}>
      <RoundedBox
        args={[width, 1.05, 0.16]}
        radius={0.25}
        smoothness={6}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.55}
          metalness={0.15}
        />
      </RoundedBox>

      <RoundedBox
        args={[width - 0.18, 0.87, 0.05]}
        radius={0.19}
        smoothness={6}
        position={[0, 0, 0.1]}
      >
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.16}
          roughness={0.7}
        />
      </RoundedBox>

      <Text
        position={[0, 0, 0.18]}
        fontSize={label === "SPACE" ? 0.58 : 0.62}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.035}
        outlineColor="#0f172a"
      >
        {label}
      </Text>
    </group>
  );
}

type ActionLabelProps = {
  position: [number, number, number];
  children: string;
  color: string;
};

function ActionLabel({
  position,
  children,
  color,
}: ActionLabelProps) {
  return (
    <group position={position}>
      <Text
        position={[0, 0, -0.12]}
        fontSize={0.63}
        color="#0f172a"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.015}
        outlineWidth={0.07}
        outlineColor="#0f172a"
        outlineOpacity={0.7}
      >
        {children}
      </Text>

      <Text
        position={[0, 0, -0.09]}
        fontSize={0.63}
        color="#0f172a"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.015}
        outlineWidth={0.07}
        outlineColor="#0f172a"
        outlineOpacity={0.72}
      >
        {children}
      </Text>

      <Text
        position={[0, 0, -0.06]}
        fontSize={0.63}
        color="#0f172a"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.015}
        outlineWidth={0.07}
        outlineColor="#0f172a"
        outlineOpacity={0.75}
      >
        {children}
      </Text>

      <Text
        position={[0, 0, -0.03]}
        fontSize={0.63}
        color="#0f172a"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.015}
        outlineWidth={0.07}
        outlineColor="#0f172a"
        outlineOpacity={0.78}
      >
        {children}
      </Text>

      <Text
        position={[0, 0, 0.05]}
        fontSize={0.63}
        color={color}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.015}
        outlineWidth={0.07}
        outlineColor="#0f172a"
        outlineOpacity={0.95}
      >
        {children}
      </Text>
    </group>
  );
}

type TitleProps = {
  position: [number, number, number];
};

function Title({ position }: TitleProps) {
  return (
    <group position={position}>
      <Text
        position={[0, 0, -0.12]}
        fontSize={1.35}
        color="#334155"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#334155"
        outlineOpacity={0.7}
      >
        TAXITECH
      </Text>

      <Text
        position={[0, 0, -0.09]}
        fontSize={1.35}
        color="#334155"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#334155"
        outlineOpacity={0.72}
      >
        TAXITECH
      </Text>

      <Text
        position={[0, 0, -0.06]}
        fontSize={1.35}
        color="#334155"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#334155"
        outlineOpacity={0.75}
      >
        TAXITECH
      </Text>

      <Text
        position={[0, 0, -0.03]}
        fontSize={1.35}
        color="#334155"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#334155"
        outlineOpacity={0.78}
      >
        TAXITECH
      </Text>

      <Text
        position={[0, 0, 0.05]}
        fontSize={1.35}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#1e293b"
        outlineOpacity={0.9}
      >
        TAXITECH
      </Text>
    </group>
  );
}

export default function StartInstructions({
  visible = true,
}: StartInstructionsProps) {
  if (!visible) return null;

  return (
    <group
      position={[0, 4.8, 63]}
      scale={1.5625}
    >
      {/* PANEL PRINCIPAL */}
      <RoundedBox
        args={[17, 8.4, 0.3]}
        radius={0.45}
        smoothness={6}
        position={[0, 0, -0.25]}
      >
        <meshStandardMaterial
          color="#475569"
          transparent
          opacity={0.78}
          roughness={0.8}
          metalness={0}
        />
      </RoundedBox>

      {/* PANEL INTERIOR */}
      <RoundedBox
        args={[16.55, 7.95, 0.08]}
        radius={0.35}
        smoothness={6}
        position={[0, 0, -0.02]}
      >
        <meshStandardMaterial
          color="#cbd5e1"
          transparent
          opacity={0.12}
          roughness={0.8}
        />
      </RoundedBox>

      {/* TITULO */}
      <Title position={[0, 2.75, 0.18]} />

      {/* ========================= */}
      {/* BLOQUE DE COMANDOS */}
      {/* ========================= */}

      {/* ENTER */}
      <CommandKey
        position={[-2.7, 0.85, 0.18]}
        label="ENTER"
        color="#facc15"
        width={2.75}
      />

      {/* INICIAR VIAJE */}
      <ActionLabel
        position={[-2.7, -0.32, 0.18]}
        color="#facc15"
      >
        INICIAR VIAJE
      </ActionLabel>

      {/* SPACE */}
      <CommandKey
        position={[-2.7, -1.65, 0.18]}
        label="SPACE"
        color="#fb923c"
        width={2.85}
      />

      {/* FINALIZAR VIAJE */}
      <ActionLabel
        position={[-2.7, -2.82, 0.18]}
        color="#fb923c"
      >
        FINALIZAR VIAJE
      </ActionLabel>

      {/* ========================= */}
      {/* BLOQUE DE FLECHAS */}
      {/* ========================= */}

      {/* ARRIBA */}
      <ArrowKey
        position={[4.25, 0.65, 0.18]}
        direction="up"
        color="#4ade80"
      />

      {/* IZQUIERDA */}
      <ArrowKey
        position={[3.35, -0.85, 0.18]}
        direction="left"
        color="#c4b5fd"
      />

      {/* DERECHA */}
      <ArrowKey
        position={[5.15, -0.85, 0.18]}
        direction="right"
        color="#c4b5fd"
      />

      {/* ABAJO / FRENO */}
      <ArrowKey
        position={[4.25, -2.25, 0.18]}
        direction="down"
        color="#ef4444"
      />
    </group>
  );
}