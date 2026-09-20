"use client";

import { useTexture } from "@react-three/drei";
import * as THREE from "three";

type FactoriaBuildingProps = {
  position?: [number, number, number];
};

export default function FactoriaBuilding({
  position = [0, 0, 0],
}: FactoriaBuildingProps) {
  const logoTexture = useTexture(
    "/images/factoria-f5.png"
  );

  // =====================================================
  // DIMENSIONES GENERALES
  // =====================================================

  const mainWidth = 7;
  const mainDepth = 5;
  const mainHeight = 8.5;

  const wingWidth = 2.8;
  const wingDepth = 6.6;
  const wingHeight = 5;

  const orange = "#ff5a00";
  const black = "#111820";
  const dark = "#202b34";
  const glass = "#73d9ff";

  return (
    <group position={position}>
      {/* =====================================================
          BASE / CAMPUS
      ===================================================== */}

      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[12.5, 0.16, 10]} />

        <meshStandardMaterial
          color="#171e24"
          roughness={0.65}
          metalness={0.3}
          transparent
          opacity={0.94}
        />
      </mesh>

      {/* =====================================================
          PLAZA FRONTAL
      ===================================================== */}

      <mesh position={[0, 0.2, 3.8]}>
        <boxGeometry args={[8.8, 0.18, 2.5]} />

        <meshStandardMaterial
          color="#303c46"
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* Líneas naranjas de la plaza */}

      <mesh position={[0, 0.31, 2.65]}>
        <boxGeometry args={[7.4, 0.05, 0.1]} />

        <meshStandardMaterial
          color={orange}
          emissive={orange}
          emissiveIntensity={0.8}
        />
      </mesh>

      <mesh position={[0, 0.31, 4.85]}>
        <boxGeometry args={[7.4, 0.05, 0.1]} />

        <meshStandardMaterial
          color={orange}
          emissive={orange}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* =====================================================
          EDIFICIO CENTRAL
      ===================================================== */}

      <mesh
        position={[0, mainHeight / 2, 0]}
      >
        <boxGeometry
          args={[
            mainWidth,
            mainHeight,
            mainDepth,
          ]}
        />

        <meshStandardMaterial
          color={dark}
          roughness={0.24}
          metalness={0.65}
          transparent
          opacity={0.94}
        />
      </mesh>

      {/* =====================================================
          FACHADA NEGRA PRINCIPAL
      ===================================================== */}

      <mesh
        position={[
          0,
          mainHeight / 2,
          mainDepth / 2 + 0.045,
        ]}
      >
        <boxGeometry
          args={[
            mainWidth - 0.4,
            mainHeight - 0.4,
            0.08,
          ]}
        />

        <meshStandardMaterial
          color={black}
          roughness={0.12}
          metalness={0.78}
          transparent
          opacity={0.78}
        />
      </mesh>

      {/* =====================================================
          GRANDES PANELES DE CRISTAL
      ===================================================== */}

      {[-2.1, -1.05, 0, 1.05, 2.1].map(
        (x) => (
          <mesh
            key={`glass-${x}`}
            position={[
              x,
              4.1,
              mainDepth / 2 + 0.1,
            ]}
          >
            <boxGeometry
              args={[0.72, 5.7, 0.04]}
            />

            <meshStandardMaterial
              color={glass}
              roughness={0.08}
              metalness={0.45}
              transparent
              opacity={0.45}
              emissive="#48cfff"
              emissiveIntensity={0.2}
            />
          </mesh>
        )
      )}

      {/* =====================================================
          ALA IZQUIERDA - CRISTAL NARANJA
      ===================================================== */}

      <mesh
        position={[
          -mainWidth / 2 -
            wingWidth / 2 +
            0.15,
          wingHeight / 2,
          0,
        ]}
      >
        <boxGeometry
          args={[
            wingWidth,
            wingHeight,
            wingDepth,
          ]}
        />

        <meshStandardMaterial
          color={orange}
          roughness={0.18}
          metalness={0.45}
          transparent
          opacity={0.42}
          emissive={orange}
          emissiveIntensity={0.18}
        />
      </mesh>

      {/* =====================================================
          ALA DERECHA - CRISTAL NARANJA
      ===================================================== */}

      <mesh
        position={[
          mainWidth / 2 +
            wingWidth / 2 -
            0.15,
          wingHeight / 2,
          0,
        ]}
      >
        <boxGeometry
          args={[
            wingWidth,
            wingHeight,
            wingDepth,
          ]}
        />

        <meshStandardMaterial
          color={orange}
          roughness={0.18}
          metalness={0.45}
          transparent
          opacity={0.42}
          emissive={orange}
          emissiveIntensity={0.18}
        />
      </mesh>

      {/* =====================================================
          FRANJAS NARANJAS DE LAS ALAS
      ===================================================== */}

      {[-1, 1].map((side) => (
        <group key={`orange-wing-${side}`}>
          <mesh
            position={[
              side * 3.85,
              2.5,
              -0.05,
            ]}
          >
            <boxGeometry
              args={[0.12, 4.5, 5.8]}
            />

            <meshStandardMaterial
              color={orange}
              emissive={orange}
              emissiveIntensity={0.35}
              metalness={0.6}
            />
          </mesh>

          <mesh
            position={[
              side * 3.85,
              0.45,
              2.85,
            ]}
          >
            <boxGeometry
              args={[0.16, 0.12, 1.1]}
            />

            <meshStandardMaterial
              color={orange}
              emissive={orange}
              emissiveIntensity={0.7}
            />
          </mesh>
        </group>
      ))}

      {/* =====================================================
          CRISTALES LATERALES
      ===================================================== */}

      {[-1, 1].map((side) => (
        <group key={`wing-windows-${side}`}>
          {[-2.1, -0.3, 1.5].map(
            (z) => (
              <mesh
                key={`window-${side}-${z}`}
                position={[
                  side * 5.18,
                  2.5,
                  z,
                ]}
              >
                <boxGeometry
                  args={[
                    0.06,
                    2.1,
                    1.05,
                  ]}
                />

                <meshStandardMaterial
                  color={glass}
                  roughness={0.1}
                  metalness={0.45}
                  transparent
                  opacity={0.7}
                  emissive="#42cfff"
                  emissiveIntensity={0.18}
                />
              </mesh>
            )
          )}
        </group>
      ))}

      {/* =====================================================
          TECHO PRINCIPAL
      ===================================================== */}

      <mesh
        position={[
          0,
          mainHeight + 0.2,
          0,
        ]}
      >
        <boxGeometry
          args={[
            mainWidth + 0.35,
            0.4,
            mainDepth + 0.35,
          ]}
        />

        <meshStandardMaterial
          color="#0e151b"
          roughness={0.18}
          metalness={0.8}
        />
      </mesh>

      {/* =====================================================
          TECHOS DE LAS ALAS
      ===================================================== */}

      {[-1, 1].map((side) => (
        <mesh
          key={`wing-roof-${side}`}
          position={[
            side * 3.85,
            wingHeight + 0.17,
            0,
          ]}
        >
          <boxGeometry
            args={[
              wingWidth + 0.3,
              0.34,
              wingDepth + 0.3,
            ]}
          />

          <meshStandardMaterial
            color="#101820"
            roughness={0.2}
            metalness={0.78}
          />
        </mesh>
      ))}

      {/* =====================================================
          CARTEL NEGRO DEL LOGO
      ===================================================== */}

      <mesh
        position={[
          0,
          mainHeight - 1.05,
          mainDepth / 2 + 0.17,
        ]}
      >
        <boxGeometry
          args={[
            mainWidth - 0.35,
            1.65,
            0.2,
          ]}
        />

        <meshStandardMaterial
          color="#05090d"
          roughness={0.1}
          metalness={0.85}
        />
      </mesh>

      {/* =====================================================
          LOGO FACTORÍA F5
      ===================================================== */}

      <mesh
        position={[
          0,
          mainHeight - 1.05,
          mainDepth / 2 + 0.29,
        ]}
      >
        <planeGeometry
          args={[4.8, 1.35]}
        />

        <meshBasicMaterial
          map={logoTexture}
          transparent
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* =====================================================
          LÍNEAS NARANJAS ALREDEDOR DEL LOGO
      ===================================================== */}

      <mesh
        position={[
          -3.05,
          mainHeight - 1.05,
          mainDepth / 2 + 0.28,
        ]}
      >
        <boxGeometry
          args={[0.12, 1.65, 0.12]}
        />

        <meshStandardMaterial
          color={orange}
          emissive={orange}
          emissiveIntensity={0.7}
        />
      </mesh>

      <mesh
        position={[
          3.05,
          mainHeight - 1.05,
          mainDepth / 2 + 0.28,
        ]}
      >
        <boxGeometry
          args={[0.12, 1.65, 0.12]}
        />

        <meshStandardMaterial
          color={orange}
          emissive={orange}
          emissiveIntensity={0.7}
        />
      </mesh>

      {/* =====================================================
          ENTRADA PRINCIPAL
      ===================================================== */}

      <mesh
        position={[
          0,
          1.25,
          mainDepth / 2 + 0.1,
        ]}
      >
        <boxGeometry
          args={[1.8, 2.5, 0.18]}
        />

        <meshStandardMaterial
          color="#05090d"
          roughness={0.1}
          metalness={0.85}
        />
      </mesh>

      {/* PUERTA DE CRISTAL */}

      <mesh
        position={[
          0,
          1.25,
          mainDepth / 2 + 0.21,
        ]}
      >
        <boxGeometry
          args={[1.25, 2.1, 0.04]}
        />

        <meshStandardMaterial
          color={glass}
          roughness={0.08}
          metalness={0.25}
          transparent
          opacity={0.58}
          emissive="#28bfff"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* =====================================================
          MARCOS NARANJAS DE LA ENTRADA
      ===================================================== */}

      <mesh
        position={[
          -0.9,
          1.3,
          mainDepth / 2 + 0.23,
        ]}
      >
        <boxGeometry
          args={[0.14, 2.75, 0.15]}
        />

        <meshStandardMaterial
          color={orange}
          emissive={orange}
          emissiveIntensity={0.65}
          metalness={0.55}
        />
      </mesh>

      <mesh
        position={[
          0.9,
          1.3,
          mainDepth / 2 + 0.23,
        ]}
      >
        <boxGeometry
          args={[0.14, 2.75, 0.15]}
        />

        <meshStandardMaterial
          color={orange}
          emissive={orange}
          emissiveIntensity={0.65}
          metalness={0.55}
        />
      </mesh>

      {/* =====================================================
          LÍNEA NARANJA INFERIOR
      ===================================================== */}

      <mesh
        position={[
          0,
          0.42,
          mainDepth / 2 + 0.09,
        ]}
      >
        <boxGeometry
          args={[
            mainWidth - 0.25,
            0.11,
            0.14,
          ]}
        />

        <meshStandardMaterial
          color={orange}
          emissive={orange}
          emissiveIntensity={1}
          metalness={0.4}
        />
      </mesh>

      {/* =====================================================
          COLUMNAS DE LA PLAZA
      ===================================================== */}

      {[-2.55, 2.55].map((x) => (
        <mesh
          key={`column-${x}`}
          position={[
            x,
            1.55,
            mainDepth / 2 + 0.85,
          ]}
        >
          <boxGeometry
            args={[0.2, 3.1, 0.2]}
          />

          <meshStandardMaterial
            color="#cbd5dc"
            roughness={0.2}
            metalness={0.75}
          />
        </mesh>
      ))}

      {/* =====================================================
          TECHO DE LA ENTRADA
      ===================================================== */}

      <mesh
        position={[
          0,
          3.05,
          mainDepth / 2 + 0.85,
        ]}
      >
        <boxGeometry
          args={[5.8, 0.18, 1.6]}
        />

        <meshStandardMaterial
          color="#151e26"
          roughness={0.2}
          metalness={0.75}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Línea naranja del techo */}

      <mesh
        position={[
          0,
          3.17,
          mainDepth / 2 + 1.62,
        ]}
      >
        <boxGeometry
          args={[5.8, 0.08, 0.1]}
        />

        <meshStandardMaterial
          color={orange}
          emissive={orange}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* =====================================================
          LUCES PRINCIPALES
      ===================================================== */}

      <pointLight
        position={[
          -2.5,
          5.8,
          mainDepth / 2 + 0.5,
        ]}
        color={orange}
        intensity={1.5}
        distance={7}
      />

      <pointLight
        position={[
          2.5,
          5.8,
          mainDepth / 2 + 0.5,
        ]}
        color={orange}
        intensity={1.5}
        distance={7}
      />

      <pointLight
        position={[
          0,
          2.2,
          mainDepth / 2 + 1.7,
        ]}
        color="#4fd5ff"
        intensity={1.2}
        distance={6}
      />

      {/* =====================================================
          LUCES LATERALES
      ===================================================== */}

      <pointLight
        position={[
          -5.2,
          2.8,
          0,
        ]}
        color={orange}
        intensity={0.8}
        distance={5}
      />

      <pointLight
        position={[
          5.2,
          2.8,
          0,
        ]}
        color={orange}
        intensity={0.8}
        distance={5}
      />
    </group>
  );
}