"use client";

type BuildingProps = {
  position?: [number, number, number];
  width?: number;
  depth?: number;
  height?: number;
  color?: string;
  windowColor?: string;
};

export default function Building({
  position = [0, 0, 0],
  width = 4,
  depth = 4,
  height = 8,
  color = "#8a8f98",
  windowColor = "#b9d7e8",
}: BuildingProps) {
  const windowRows = Math.max(
    2,
    Math.floor(height / 2)
  );

  const windowColumns = Math.max(
    2,
    Math.floor(width / 1.3)
  );

  const windows = [];

  for (let row = 0; row < windowRows; row++) {
    for (
      let column = 0;
      column < windowColumns;
      column++
    ) {
      const x =
        -width / 2 +
        0.7 +
        column *
          ((width - 1.4) /
            Math.max(windowColumns - 1, 1));

      const y =
        1.3 +
        row *
          ((height - 2) /
            Math.max(windowRows - 1, 1));

      windows.push(
        <mesh
          key={`front-${row}-${column}`}
          position={[
            x,
            y,
            depth / 2 + 0.02,
          ]}
        >
          <boxGeometry args={[0.55, 0.75, 0.08]} />
          <meshStandardMaterial
            color={windowColor}
            roughness={0.35}
            metalness={0.1}
          />
        </mesh>
      );
    }
  }

  return (
    <group position={position}>
      {/* Edificio */}
      <mesh
        castShadow
        receiveShadow
        position={[0, height / 2, 0]}
      >
        <boxGeometry
          args={[width, height, depth]}
        />

        <meshStandardMaterial
          color={color}
          roughness={0.8}
          metalness={0}
        />
      </mesh>

      {/* Fachada superior */}
      <mesh
        castShadow
        receiveShadow
        position={[
          0,
          height + 0.15,
          0,
        ]}
      >
        <boxGeometry
          args={[
            width + 0.15,
            0.3,
            depth + 0.15,
          ]}
        />

        <meshStandardMaterial
          color="#555b63"
          roughness={0.75}
        />
      </mesh>

      {/* Ventanas */}
      {windows}

      {/* Puerta */}
      <mesh
        position={[
          0,
          1,
          depth / 2 + 0.025,
        ]}
      >
        <boxGeometry
          args={[0.9, 2, 0.08]}
        />

        <meshStandardMaterial
          color="#30343b"
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}