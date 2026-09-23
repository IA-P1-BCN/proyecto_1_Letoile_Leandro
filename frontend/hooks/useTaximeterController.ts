"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  startRide,
  moveRide,
  stopRide,
  finishRide,
  getTaximeterState,
  getTaximeterCurrent,
} from "../lib/api/taximeter";

import type { VehicleStatus } from "../components/3d/Taxi";

export type TripState =
  | "idle"
  | "running"
  | "finishing"
  | "finished";

type BackendRideState =
  | "idle"
  | "stopped"
  | "moving";

type UseTaximeterControllerOptions = {
  onFinishReady?: () => void;
};

export default function useTaximeterController(
  options: UseTaximeterControllerOptions = {}
) {
  const { onFinishReady } = options;

  const [tripState, setTripState] =
    useState<TripState>("idle");

  const [vehicleStatus, setVehicleStatus] =
    useState<VehicleStatus>("stopped");

  const [amount, setAmount] = useState(0);

  const transitionInProgressRef =
    useRef(false);

  const backendVehicleStatusRef =
    useRef<VehicleStatus>("stopped");

  const backendQueueRef =
    useRef<Promise<void>>(Promise.resolve());

  /**
   * Identifica la generación actual de sincronización.
   *
   * Si una petición vieja vuelve después de un cambio
   * de carrera, no podrá sobrescribir el estado nuevo.
   */
  const syncGenerationRef = useRef(0);

  /**
   * Evita que dos reconciliaciones se ejecuten
   * simultáneamente.
   */
  const reconcileInProgressRef =
    useRef(false);

  /**
   * Evita ejecutar más de una vez la lógica
   * de recuperación después de un refresh.
   */
  const refreshRecoveryDoneRef =
    useRef(false);

  // =====================================================
  // BACKEND QUEUE
  // =====================================================

  const enqueueBackendAction = useCallback(
    (action: () => Promise<void>) => {
      const actionPromise =
        backendQueueRef.current.then(action);

      /**
       * La cola continúa funcionando incluso si una
       * acción anterior falla.
       */
      backendQueueRef.current =
        actionPromise.catch(() => undefined);

      return actionPromise;
    },
    []
  );

  // =====================================================
  // RECONCILIAR FRONTEND CON BACKEND
  // =====================================================

  const reconcileWithBackend =
    useCallback(async () => {
      if (reconcileInProgressRef.current) {
        return;
      }

      reconcileInProgressRef.current = true;

      const generation =
        ++syncGenerationRef.current;

      try {
        const state =
          await getTaximeterState();

        /**
         * Si durante la petición cambió la generación,
         * esta respuesta ya no representa necesariamente
         * la carrera actual.
         */
        if (
          generation !==
          syncGenerationRef.current
        ) {
          return;
        }

        const backendState =
          state.state as BackendRideState;

        // =================================================
        // BACKEND SIN CARRERA
        // =================================================

        if (backendState === "idle") {
          const current =
            await getTaximeterCurrent();

          if (
            generation !==
            syncGenerationRef.current
          ) {
            return;
          }

          /**
           * Si estamos mostrando la animación final,
           * mantenemos el importe final y dejamos que
           * Scene controle el paso a "finished".
           */
          if (
            tripState !== "finishing" &&
            tripState !== "finished"
          ) {
            setAmount(current.total);

            setVehicleStatus("stopped");

            backendVehicleStatusRef.current =
              "stopped";

            setTripState("idle");
          }

          return;
        }

        // =================================================
        // BACKEND CON CARRERA ACTIVA
        // =================================================

        const current =
          await getTaximeterCurrent();

        if (
          generation !==
          syncGenerationRef.current
        ) {
          return;
        }

        setAmount(current.total);

        if (backendState === "moving") {
          setVehicleStatus("moving");

          backendVehicleStatusRef.current =
            "moving";
        } else {
          setVehicleStatus("stopped");

          backendVehicleStatusRef.current =
            "stopped";
        }

        /**
         * Si el frontend estaba idle/finished,
         * significa que el backend tiene una carrera
         * activa que el frontend necesita recuperar.
         */
        if (
          tripState === "idle" ||
          tripState === "finished"
        ) {
          setTripState("running");
        }
      } catch (error) {
        console.error(
          "Error reconciliando taxímetro con backend:",
          error
        );
      } finally {
        reconcileInProgressRef.current =
          false;
      }
    }, [tripState]);

  // =====================================================
  // RECUPERACIÓN INICIAL / REFRESH
  // =====================================================

  useEffect(() => {
    const recoverInitialState =
      async () => {
        /**
         * Solo queremos finalizar automáticamente
         * una carrera cuando la página se abrió por
         * un REFRESH real.
         *
         * Minimizar la ventana no ejecuta esta lógica.
         */
        const navigationEntry =
          performance.getEntriesByType(
            "navigation"
          )[0] as
            | PerformanceNavigationTiming
            | undefined;

        const isRefresh =
          navigationEntry?.type === "reload";

        /**
         * Evitamos ejecutar la recuperación más
         * de una vez durante el ciclo de vida
         * de este componente.
         */
        if (
          refreshRecoveryDoneRef.current
        ) {
          return;
        }

        refreshRecoveryDoneRef.current =
          true;

        try {
          /**
           * Primero comprobamos el estado REAL
           * del backend.
           */
          const state =
            await getTaximeterState();

          const backendState =
            state.state as BackendRideState;

          // =================================================
          // REFRESH + CARRERA ACTIVA
          // =================================================

          if (
            isRefresh &&
            backendState !== "idle"
          ) {
            /**
             * Invalidamos cualquier GET anterior.
             */
            syncGenerationRef.current += 1;

            /**
             * Finalizamos la carrera anterior.
             *
             * Esto:
             * 1. guarda el RideRecord
             * 2. ejecuta self.ride = None
             * 3. deja el current del backend en cero
             */
            await enqueueBackendAction(
              async () => {
                await finishRide();
              }
            );

            /**
             * MUY IMPORTANTE:
             *
             * No usamos response.total aquí.
             *
             * Ese total pertenece a la carrera anterior.
             *
             * Después de finishRide(), el backend debería
             * estar en:
             *
             * state = idle
             * total = 0
             */
            const current =
              await getTaximeterCurrent();

            /**
             * Invalidamos nuevamente cualquier respuesta
             * anterior antes de modificar el estado visual.
             */
            syncGenerationRef.current += 1;

            /**
             * El frontend vuelve explícitamente a cero.
             *
             * current.total debería ser 0 porque el backend
             * ya no tiene una carrera activa.
             *
             * Usamos 0 directamente porque el objetivo del
             * refresh es comenzar una sesión limpia.
             */
            setAmount(0);

            setVehicleStatus("stopped");

            backendVehicleStatusRef.current =
              "stopped";

            setTripState("idle");

            /**
             * Si por algún motivo el backend devolviera
             * un current inesperado, lo dejamos registrado
             * para poder detectar el problema sin volver a
             * mostrar el importe anterior.
             */
            if (current.total !== 0) {
              console.warn(
                "El backend finalizó la carrera pero current.total no quedó en 0:",
                current.total
              );
            }

            return;
          }

          // =================================================
          // REFRESH SIN CARRERA ACTIVA
          // =================================================

          if (isRefresh) {
            /**
             * Si no había carrera activa, igualmente
             * dejamos el frontend limpio.
             */
            syncGenerationRef.current += 1;

            setAmount(0);

            setVehicleStatus("stopped");

            backendVehicleStatusRef.current =
              "stopped";

            setTripState("idle");

            return;
          }

          // =================================================
          // CARGA NORMAL
          // =================================================

          /**
           * Si NO fue un refresh, hacemos la
           * reconciliación habitual.
           *
           * Esto permite recuperar una carrera que
           * sigue activa en backend.
           */
          await reconcileWithBackend();
        } catch (error) {
          console.error(
            "Error recuperando estado inicial del taxímetro:",
            error
          );

          /**
           * Si algo falla, intentamos recuperar
           * igualmente el estado real del backend.
           */
          await reconcileWithBackend();
        }
      };

    recoverInitialState();
  }, [
    enqueueBackendAction,
    reconcileWithBackend,
  ]);

  // =====================================================
  // RECUPERACIÓN AL VOLVER A LA VENTANA
  // =====================================================

  useEffect(() => {
    const handleVisibilityChange =
      () => {
        if (
          document.visibilityState !==
          "visible"
        ) {
          return;
        }

        /**
         * Invalidamos respuestas anteriores.
         */
        syncGenerationRef.current += 1;

        reconcileWithBackend();
      };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [reconcileWithBackend]);

  // =====================================================
  // START
  // =====================================================

  const handleStart = useCallback(
    async () => {
      if (
        transitionInProgressRef.current
      ) {
        return;
      }

      if (
        tripState !== "idle" &&
        tripState !== "finished"
      ) {
        return;
      }

      transitionInProgressRef.current =
        true;

      /**
       * Nueva generación.
       *
       * Cualquier GET anterior deja de ser válido.
       */
      syncGenerationRef.current += 1;

      /**
       * Reset visual inmediato.
       */
      setAmount(0);

      try {
        await enqueueBackendAction(
          async () => {
            /**
             * El backend inicia la nueva carrera.
             */
            await startRide();

            /**
             * Confirmamos el estado real de la
             * nueva carrera.
             */
            const state =
              await getTaximeterState();

            if (
              state.state !== "stopped" &&
              state.state !== "moving"
            ) {
              throw new Error(
                "El backend no confirmó una carrera activa después de iniciar."
              );
            }

            const current =
              await getTaximeterCurrent();

            setAmount(current.total);

            setVehicleStatus(
              state.state === "moving"
                ? "moving"
                : "stopped"
            );

            backendVehicleStatusRef.current =
              state.state === "moving"
                ? "moving"
                : "stopped";
          }
        );

        setTripState("running");
      } catch (error) {
        console.error(
          "Error iniciando la carrera:",
          error
        );

        /**
         * Si Start falla, volvemos a consultar
         * el backend para recuperar el estado real.
         */
        await reconcileWithBackend();
      } finally {
        transitionInProgressRef.current =
          false;
      }
    },
    [
      tripState,
      enqueueBackendAction,
      reconcileWithBackend,
    ]
  );

  // =====================================================
  // FINISH
  // =====================================================

  const handleFinish = useCallback(
    async () => {
      if (
        transitionInProgressRef.current
      ) {
        return;
      }

      if (tripState !== "running") {
        return;
      }

      transitionInProgressRef.current =
        true;

      /**
       * Invalidamos requests anteriores.
       */
      syncGenerationRef.current += 1;

      try {
        await enqueueBackendAction(
          async () => {
            /**
             * El backend confirma la finalización.
             */
            const response =
              await finishRide();

            /**
             * El importe final pertenece a la
             * carrera recién terminada.
             *
             * Este importe se conserva durante
             * toda la animación final.
             */
            setAmount(response.total);

            /**
             * Backend ya está en idle.
             */
            backendVehicleStatusRef.current =
              "stopped";

            setVehicleStatus("stopped");
          }
        );

        /**
         * Recién después de que finishRide()
         * terminó correctamente comenzamos
         * la animación visual.
         */
        setTripState("finishing");
      } catch (error) {
        console.error(
          "Error finalizando la carrera:",
          error
        );

        /**
         * No pasamos a "finishing" si el backend
         * no confirmó el finish.
         */
        await reconcileWithBackend();
      } finally {
        transitionInProgressRef.current =
          false;
      }
    },
    [
      tripState,
      enqueueBackendAction,
      reconcileWithBackend,
    ]
  );

  // =====================================================
  // ESTADO DEL TAXI
  // =====================================================

  const handleVehicleStatusChange =
    useCallback(
      (status: VehicleStatus) => {
        setVehicleStatus(status);

        if (tripState !== "running") {
          return;
        }

        if (
          transitionInProgressRef.current
        ) {
          return;
        }

        if (
          backendVehicleStatusRef.current ===
          status
        ) {
          return;
        }

        /**
         * Actualizamos inmediatamente la referencia
         * para evitar enviar la misma transición
         * varias veces.
         */
        backendVehicleStatusRef.current =
          status;

        if (status === "moving") {
          enqueueBackendAction(
            async () => {
              await moveRide();
            }
          ).catch(async (error) => {
            console.error(
              "Error enviando movimiento al backend:",
              error
            );

            await reconcileWithBackend();
          });

          return;
        }

        if (status === "stopped") {
          enqueueBackendAction(
            async () => {
              await stopRide();
            }
          ).catch(async (error) => {
            console.error(
              "Error deteniendo el taxi en backend:",
              error
            );

            await reconcileWithBackend();
          });
        }
      },
      [
        tripState,
        enqueueBackendAction,
        reconcileWithBackend,
      ]
    );

  // =====================================================
  // FIN DE LA ANIMACIÓN
  // =====================================================

  const handleFinishSequence =
    useCallback(() => {
      setVehicleStatus("stopped");

      setTripState("finished");

      onFinishReady?.();
    }, [onFinishReady]);

  // =====================================================
  // POLLING
  // =====================================================

  useEffect(() => {
    if (tripState !== "running") {
      return;
    }

    let cancelled = false;

    const syncCurrent = async () => {
      if (cancelled) {
        return;
      }

      /**
       * No iniciamos otro GET si ya estamos
       * reconciliando.
       */
      if (
        reconcileInProgressRef.current
      ) {
        return;
      }

      const generation =
        syncGenerationRef.current;

      try {
        const current =
          await getTaximeterCurrent();

        if (
          cancelled ||
          generation !==
            syncGenerationRef.current
        ) {
          return;
        }

        /**
         * Si el backend informa idle,
         * el frontend quedó desincronizado.
         */
        if (current.state === "idle") {
          await reconcileWithBackend();
          return;
        }

        setAmount(current.total);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Error sincronizando taxímetro:",
          error
        );
      }
    };

    syncCurrent();

    const interval =
      window.setInterval(
        syncCurrent,
        500
      );

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [
    tripState,
    reconcileWithBackend,
  ]);

  // =====================================================
  // API DEL CONTROLLER
  // =====================================================

  return {
    tripState,
    vehicleStatus,
    amount,
    handleStart,
    handleFinish,
    handleVehicleStatusChange,
    handleFinishSequence,
    reconcileWithBackend,
  };
}