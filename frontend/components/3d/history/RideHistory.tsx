"use client";

import { useEffect, useMemo } from "react";

import useRideHistory from "../../../hooks/useRideHistory";
import RideHistoryItem from "./RideHistoryItem";
import HistorySummary from "./HistorySummary";

type RideHistoryProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function RideHistory({
  open,
  onOpenChange,
}: RideHistoryProps) {
  const {
    rides,
    loading,
    error,
    refreshHistory,
  } = useRideHistory();

  useEffect(() => {
    if (open) {
      refreshHistory();
    }
  }, [open, refreshHistory]);

  const totalAmount = useMemo(() => {
    return rides.reduce(
      (sum, ride) => sum + ride.total,
      0
    );
  }, [rides]);

  function handleClose() {
    onOpenChange(false);
  }

  const sortedRides = useMemo(() => {
    return [...rides].sort(
      (a, b) => b.ride_id - a.ride_id
    );
  }, [rides]);

  return (
    <>
      {open && (
        <div
          className="ride-history-overlay"
          onClick={handleClose}
        >
          <div
            className="ride-history-modal"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <div className="ride-history-header">
              <div>
                <div className="ride-history-eyebrow">
                  TTX-247 · RIDE LOG
                </div>

                <h2 className="ride-history-title">
                  Historial de carreras
                </h2>

                <p className="ride-history-subtitle">
                  Registro de operaciones del sistema
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Cerrar historial"
                className="ride-history-close"
              >
                ×
              </button>
            </div>

            <div className="ride-history-summary">
              <HistorySummary
                rideCount={rides.length}
                totalAmount={totalAmount}
              />
            </div>

            <div className="ride-history-content">
              {loading && (
                <div className="ride-history-state">
                  <span className="ride-history-loader" />

                  <span>
                    Cargando historial...
                  </span>
                </div>
              )}

              {error && !loading && (
                <div className="ride-history-state ride-history-state-error">
                  <span className="ride-history-state-icon">
                    !
                  </span>

                  <div>
                    <strong>
                      Error al cargar el historial
                    </strong>

                    <span>{error}</span>
                  </div>
                </div>
              )}

              {!loading &&
                !error &&
                rides.length === 0 && (
                  <div className="ride-history-state">
                    <span className="ride-history-empty-icon">
                      ◫
                    </span>

                    <div>
                      <strong>
                        Sin registros
                      </strong>

                      <span>
                        Todavía no hay carreras
                        registradas.
                      </span>
                    </div>
                  </div>
                )}

              {!loading &&
                !error &&
                sortedRides.length > 0 && (
                  <div className="ride-history-table">
                    <div className="ride-history-table-header">
                      <span>ID</span>
                      <span>Fecha y hora</span>
                      <span>Duración</span>
                      <span>Total</span>
                    </div>

                    <div className="ride-history-list">
                      {sortedRides.map((ride) => (
                        <RideHistoryItem
                          key={ride.ride_id}
                          ride={ride}
                        />
                      ))}
                    </div>
                  </div>
                )}
            </div>

            <div className="ride-history-footer">
              <div className="ride-history-footer-status">
                <span />
                SISTEMA OPERATIVO
              </div>

              <span>
                TAXITECH SOLUTIONS · TTX-247
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}