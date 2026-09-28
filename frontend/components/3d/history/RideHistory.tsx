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
      (a, b) => a.ride_id - b.ride_id
    );
  }, [rides]);

  return (
    <>
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            background: "rgba(0,0,0,0.65)",
          }}
          onClick={handleClose}
        >
          <div
            style={{
              width: "min(720px, 100%)",
              maxHeight: "80vh",
              overflow: "hidden",
              borderRadius: "16px",
              border:
                "1px solid rgba(255,255,255,0.12)",
              background: "#07111f",
              boxShadow:
                "0 25px 80px rgba(0,0,0,0.5)",
            }}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 24px",
                borderBottom:
                  "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    color: "#ffffff",
                    fontSize: "20px",
                  }}
                >
                  Historial de carreras
                </h2>

                <HistorySummary
                  rideCount={rides.length}
                  totalAmount={totalAmount}
                />
              </div>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Cerrar historial"
                style={{
                  width: "36px",
                  height: "36px",
                  border: "none",
                  borderRadius: "8px",
                  background:
                    "rgba(255,255,255,0.05)",
                  color: "#8da2b8",
                  fontSize: "24px",
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                maxHeight:
                  "calc(80vh - 100px)",
                overflowY: "auto",
                padding: "0 24px 20px",
              }}
            >
              {loading && (
                <div
                  style={{
                    padding: "40px 0",
                    color: "#8da2b8",
                    textAlign: "center",
                  }}
                >
                  Cargando historial...
                </div>
              )}

              {error && !loading && (
                <div
                  style={{
                    padding: "40px 0",
                    color: "#ff8a8a",
                    textAlign: "center",
                  }}
                >
                  {error}
                </div>
              )}

              {!loading &&
                !error &&
                rides.length === 0 && (
                  <div
                    style={{
                      padding: "40px 0",
                      color: "#8da2b8",
                      textAlign: "center",
                    }}
                  >
                    Todavía no hay carreras
                    registradas.
                  </div>
                )}

              {!loading &&
                !error &&
                sortedRides.length > 0 && (
                  <div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "50px minmax(180px, 1fr) 100px 100px",
                        gap: "12px",
                        padding:
                          "16px 0 10px",
                        color: "#60758b",
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform:
                          "uppercase",
                      }}
                    >
                      <span>#</span>
                      <span>Fecha</span>
                      <span>Duración</span>
                      <span
                        style={{
                          textAlign: "right",
                        }}
                      >
                        Total
                      </span>
                    </div>

                    {sortedRides.map((ride) => (
                      <RideHistoryItem
                        key={ride.ride_id}
                        ride={ride}
                      />
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}