"use client";

import { useFrame } from "@react-three/fiber";
import {
  forwardRef,
  useMemo,
  useRef,
} from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

import type { TaxiControlsState } from "./controls/TaxiControls";

export type VehicleStatus =
  | "stopped"
  | "moving";

type TaxiProps = {
  controls: React.RefObject<
    TaxiControlsState | null
  >;
  tripActive: boolean;
  onSpeedChange?: (
    speed: number
  ) => void;
  onVehicleStatusChange?: (
    status: VehicleStatus
  ) => void;
};

const Taxi = forwardRef<
  THREE.Group,
  TaxiProps
>(
  (
    {
      controls,
      tripActive,
      onSpeedChange,
      onVehicleStatusChange,
    },
    ref
  ) => {
    const speed = useRef(0);

    const lastReportedSpeed =
      useRef(0);

    const lastVehicleStatus =
      useRef<VehicleStatus>("stopped");

    const maxSpeed = 12;
    const acceleration = 8;
    const braking = 18;
    const friction = 4;
    const rotationSpeed = 2;

    const { scene } = useGLTF(
      "/models/taxi/taxi.glb"
    );

    const taxiBounds = useMemo(() => {
      const box = new THREE.Box3().setFromObject(
        scene
      );

      const center = new THREE.Vector3();
      const size = new THREE.Vector3();

      box.getCenter(center);
      box.getSize(size);

      return {
        center,
        size,
        bottom: box.min.y,
      };
    }, [scene]);

    const modelScale = 0.69;

    const taxiCenterX =
      taxiBounds.center.x * modelScale;

    const taxiCenterZ =
      taxiBounds.center.z * modelScale;

    /*
     * Glow situado debajo del taxi.
     */
    const glowY = -0.30;

    /*
     * Glow hacia el interior del taxi.
     */
    const frontOffset = -1.5;
    const rearOffset = 1.5;

    useMemo(() => {
      scene.traverse((object) => {
        object.renderOrder = 2;
      });
    }, [scene]);

    useFrame((_, delta) => {
      const taxi =
        ref && "current" in ref
          ? ref.current
          : null;

      if (!taxi) {
        return;
      }

      const input = controls.current;

      /*
       * Si el viaje no está activo,
       * el taxi permanece detenido.
       */
      if (!tripActive) {
        speed.current = 0;

        if (
          lastReportedSpeed.current !== 0
        ) {
          lastReportedSpeed.current = 0;

          onSpeedChange?.(0);
        }

        if (
          lastVehicleStatus.current !==
          "stopped"
        ) {
          lastVehicleStatus.current =
            "stopped";

          onVehicleStatusChange?.(
            "stopped"
          );
        }

        return;
      }

      /*
       * ACELERACIÓN
       */
      if (
        input.forward &&
        !input.brake
      ) {
        speed.current +=
          acceleration * delta;
      }

      /*
       * FRENO
       */
      if (input.brake) {
        speed.current = Math.max(
          0,
          speed.current -
            braking * delta
        );
      }

      /*
       * FRICCIÓN NATURAL
       */
      if (
        !input.forward &&
        !input.brake
      ) {
        speed.current = Math.max(
          0,
          speed.current -
            friction * delta
        );
      }

      /*
       * Limitar velocidad máxima.
       */
      speed.current =
        THREE.MathUtils.clamp(
          speed.current,
          0,
          maxSpeed
        );

      /*
       * Comunicar velocidad.
       */
      if (
        speed.current === 0 ||
        Math.abs(
          speed.current -
            lastReportedSpeed.current
        ) > 0.1
      ) {
        lastReportedSpeed.current =
          speed.current;

        onSpeedChange?.(
          speed.current
        );
      }

      /*
       * Estado según velocidad real.
       */
      const currentVehicleStatus =
        speed.current > 0.1
          ? "moving"
          : "stopped";

      if (
        currentVehicleStatus !==
        lastVehicleStatus.current
      ) {
        lastVehicleStatus.current =
          currentVehicleStatus;

        onVehicleStatusChange?.(
          currentVehicleStatus
        );
      }

      /*
       * GIRO
       */
      if (speed.current > 0.1) {
        if (input.left) {
          taxi.rotation.y +=
            rotationSpeed * delta;
        }

        if (input.right) {
          taxi.rotation.y -=
            rotationSpeed * delta;
        }
      }

      /*
       * MOVIMIENTO
       */
      if (speed.current > 0) {
        const forward =
          new THREE.Vector3(
            0,
            0,
            -1
          );

        forward.applyQuaternion(
          taxi.quaternion
        );

        taxi.position.addScaledVector(
          forward,
          speed.current * delta
        );
      }
    });

    return (
      <group
        ref={ref}
        position={[-1, 0.25, 76]}
      >
        {/* =====================================================
            GLOW DELANTERO - IZQUIERDO
        ====================================================== */}

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[
            taxiCenterX - 1.35,
            glowY,
            taxiCenterZ + frontOffset,
          ]}
          renderOrder={1}
        >
          <planeGeometry
            args={[3.8, 4.7]}
          />

          <shaderMaterial
            transparent
            depthWrite={false}
            depthTest={true}
            blending={THREE.AdditiveBlending}
            uniforms={{
              color: {
                value: new THREE.Color(
                  "#8b5cf6"
                ),
              },
            }}
            vertexShader={`
              varying vec2 vUv;

              void main() {
                vUv = uv;

                gl_Position =
                  projectionMatrix *
                  modelViewMatrix *
                  vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              uniform vec3 color;

              varying vec2 vUv;

              void main() {

                /*
                 * Coordenadas centradas.
                 */
                vec2 p =
                  vUv - vec2(0.5);

                /*
                 * Escalado horizontal
                 * para crear una forma alargada.
                 */
                p.x *= 0.30;
                p.y *= 0.95;

                /*
                 * Distancia al centro.
                 */
                float d =
                  length(p);

                /*
                 * Glow radial suave.
                 */
                float radialGlow =
                  1.0 -
                  smoothstep(
                    0.02,
                    0.78,
                    d
                  );

                /*
                 * Extremos redondeados.
                 *
                 * En lugar de cortar
                 * bruscamente el plano,
                 * hacemos que desaparezca
                 * progresivamente.
                 */
                float roundedEnds =
                  1.0 -
                  smoothstep(
                    0.32,
                    0.50,
                    abs(p.y)
                  );

                /*
                 * Redondeo lateral.
                 *
                 * Evita que queden
                 * esquinas rectas.
                 */
                float roundedSides =
                  1.0 -
                  smoothstep(
                    0.06,
                    0.22,
                    abs(p.x)
                  );

                /*
                 * Combinamos las máscaras.
                 */
                float glow =
                  radialGlow *
                  roundedEnds *
                  roundedSides;

                /*
                 * Hace la transición
                 * todavía más suave.
                 */
                glow =
                  pow(glow, 1.65);

                /*
                 * Intensidad final.
                 */
                float alpha =
                  glow * 0.20;

                /*
                 * El fragmento desaparece
                 * completamente fuera
                 * de la forma.
                 */
                if (alpha < 0.003) {
                  discard;
                }

                gl_FragColor =
                  vec4(
                    color,
                    alpha
                  );
              }
            `}
          />
        </mesh>

        {/* =====================================================
            GLOW DELANTERO - DERECHO
        ====================================================== */}

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[
            taxiCenterX + 1.35,
            glowY,
            taxiCenterZ + frontOffset,
          ]}
          renderOrder={1}
        >
          <planeGeometry
            args={[3.8, 4.7]}
          />

          <shaderMaterial
            transparent
            depthWrite={false}
            depthTest={true}
            blending={THREE.AdditiveBlending}
            uniforms={{
              color: {
                value: new THREE.Color(
                  "#8b5cf6"
                ),
              },
            }}
            vertexShader={`
              varying vec2 vUv;

              void main() {
                vUv = uv;

                gl_Position =
                  projectionMatrix *
                  modelViewMatrix *
                  vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              uniform vec3 color;

              varying vec2 vUv;

              void main() {
                vec2 p =
                  vUv - vec2(0.5);

                p.x *= 0.30;
                p.y *= 0.95;

                float d =
                  length(p);

                float radialGlow =
                  1.0 -
                  smoothstep(
                    0.02,
                    0.78,
                    d
                  );

                float roundedEnds =
                  1.0 -
                  smoothstep(
                    0.32,
                    0.50,
                    abs(p.y)
                  );

                float roundedSides =
                  1.0 -
                  smoothstep(
                    0.06,
                    0.22,
                    abs(p.x)
                  );

                float glow =
                  radialGlow *
                  roundedEnds *
                  roundedSides;

                glow =
                  pow(glow, 1.65);

                float alpha =
                  glow * 0.20;

                if (alpha < 0.003) {
                  discard;
                }

                gl_FragColor =
                  vec4(
                    color,
                    alpha
                  );
              }
            `}
          />
        </mesh>

        {/* =====================================================
            GLOW TRASERO - IZQUIERDO
        ====================================================== */}

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[
            taxiCenterX - 1.35,
            glowY,
            taxiCenterZ + rearOffset,
          ]}
          renderOrder={1}
        >
          <planeGeometry
            args={[3.8, 4.7]}
          />

          <shaderMaterial
            transparent
            depthWrite={false}
            depthTest={true}
            blending={THREE.AdditiveBlending}
            uniforms={{
              color: {
                value: new THREE.Color(
                  "#8b5cf6"
                ),
              },
            }}
            vertexShader={`
              varying vec2 vUv;

              void main() {
                vUv = uv;

                gl_Position =
                  projectionMatrix *
                  modelViewMatrix *
                  vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              uniform vec3 color;

              varying vec2 vUv;

              void main() {
                vec2 p =
                  vUv - vec2(0.5);

                p.x *= 0.30;
                p.y *= 0.95;

                float d =
                  length(p);

                float radialGlow =
                  1.0 -
                  smoothstep(
                    0.02,
                    0.78,
                    d
                  );

                float roundedEnds =
                  1.0 -
                  smoothstep(
                    0.32,
                    0.50,
                    abs(p.y)
                  );

                float roundedSides =
                  1.0 -
                  smoothstep(
                    0.06,
                    0.22,
                    abs(p.x)
                  );

                float glow =
                  radialGlow *
                  roundedEnds *
                  roundedSides;

                glow =
                  pow(glow, 1.65);

                float alpha =
                  glow * 0.20;

                if (alpha < 0.003) {
                  discard;
                }

                gl_FragColor =
                  vec4(
                    color,
                    alpha
                  );
              }
            `}
          />
        </mesh>

        {/* =====================================================
            GLOW TRASERO - DERECHO
        ====================================================== */}

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[
            taxiCenterX + 1.35,
            glowY,
            taxiCenterZ + rearOffset,
          ]}
          renderOrder={1}
        >
          <planeGeometry
            args={[3.8, 4.7]}
          />

          <shaderMaterial
            transparent
            depthWrite={false}
            depthTest={true}
            blending={THREE.AdditiveBlending}
            uniforms={{
              color: {
                value: new THREE.Color(
                  "#8b5cf6"
                ),
              },
            }}
            vertexShader={`
              varying vec2 vUv;

              void main() {
                vUv = uv;

                gl_Position =
                  projectionMatrix *
                  modelViewMatrix *
                  vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              uniform vec3 color;

              varying vec2 vUv;

              void main() {
                vec2 p =
                  vUv - vec2(0.5);

                p.x *= 0.30;
                p.y *= 0.95;

                float d =
                  length(p);

                float radialGlow =
                  1.0 -
                  smoothstep(
                    0.02,
                    0.78,
                    d
                  );

                float roundedEnds =
                  1.0 -
                  smoothstep(
                    0.32,
                    0.50,
                    abs(p.y)
                  );

                float roundedSides =
                  1.0 -
                  smoothstep(
                    0.06,
                    0.22,
                    abs(p.x)
                  );

                float glow =
                  radialGlow *
                  roundedEnds *
                  roundedSides;

                glow =
                  pow(glow, 1.65);

                float alpha =
                  glow * 0.20;

                if (alpha < 0.003) {
                  discard;
                }

                gl_FragColor =
                  vec4(
                    color,
                    alpha
                  );
              }
            `}
          />
        </mesh>

        {/* =====================================================
            TAXI
        ====================================================== */}

        <primitive
          object={scene}
          scale={modelScale}
        />
      </group>
    );
  }
);

Taxi.displayName = "Taxi";

useGLTF.preload(
  "/models/taxi/taxi.glb"
);

export default Taxi;