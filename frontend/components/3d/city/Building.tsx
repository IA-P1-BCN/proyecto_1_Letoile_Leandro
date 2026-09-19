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
  color = "#6f8494",
  windowColor = "#b9e9ff",
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

  for (
    let row = 0;
    row < windowRows;
    row++
  ) {
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
            Math.max(
              windowColumns - 1,
              1
            ));

      const y =
        1.3 +
        row *
          ((height - 2) /
            Math.max(
              windowRows - 1,
              1
            ));

      windows.push(
        <mesh
          key={`front-${row}-${column}`}
          position={[
            x,
            y,
            depth / 2 + 0.02,
          ]}
        >
          <boxGeometry
            args={[
              0.55,
              0.75,
              0.08,
            ]}
          />

          <meshStandardMaterial
            color={windowColor}
            roughness={0.2}
            metalness={0.4}
            emissive={windowColor}
            emissiveIntensity={0.15}
          />
        </mesh>
      );
    }
  }

  return (
    <group position={position}>
      {/* Edificio futurista */}
      <mesh
        position={[
          0,
          height / 2,
          0,
        ]}
      >
        <boxGeometry
          args={[
            width,
            height,
            depth,
          ]}
        />

        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.35}
          transparent
          opacity={0.78}
        />
      </mesh>

      {/* Techo */}
      <mesh
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
          color="#384b5c"
          roughness={0.25}
          metalness={0.5}
          transparent
          opacity={0.85}
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
          args={[
            0.9,
            2,
            0.08,
          ]}
        />

        <meshStandardMaterial
          color="#243746"
          roughness={0.2}
          metalness={0.6}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}