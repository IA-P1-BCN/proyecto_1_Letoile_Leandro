"use client";

import { useMemo, useState } from "react";

import useRideHistory from "../../../hooks/useRideHistory";

import RideHistoryItem from "./RideHistoryItem";
import HistorySummary from "./HistorySummary";

export default function RideHistory() {
  const [open, setOpen] = useState(false);

  const {
    rides,
    loading,
    error,
    refreshHistory,
  } = useRideHistory();

  const totalAmount = useMemo(() => {
    return rides.reduce(
      (sum, ride) => sum + ride.total,
      0
    );
  }, [rides]);

  function handleOpen() {
    setOpen(true);
    refreshHistory();
  }

  function handleClose() {
    setOpen(false);
  }

  // =====================================================
  // ORDEN DEL HISTORIAL
  // =====================================================
  // Mostramos las carreras de menor a mayor ID:
  //
  // #1
  // #2
  // #3
  // #4
  //
  // No modificamos el array original de rides.
  // =====================================================

  const sortedRides = useMemo(() => {
    return [...rides].sort(
      (a, b) => a.ride_id - b.ride_id
    );
  }, [rides]);

  return (
    <>
      {/* =====================================================
          BOTÓN HISTORIAL
      ===================================================== */}

      <button
        type="button"
        onClick={handleOpen}
        style={{
          position: "fixed",
          right: "24px",
          bottom: "24px",
          zIndex: 100,
          padding: "12px 20px",
          border:
            "1px solid rgba(255,255,255,0.15)",
          borderRadius: "10px",
          background: "rgba(7,17,31,0.92)",
          color: "#ffffff",
          fontSize: "14px",
          fontWeight: 700,
          cursor: "pointer",
          backdropFilter: "blur(10px)",
        }}
      >
        HISTORIAL
      </button>

      {/* =====================================================
          MODAL
      ===================================================== */}

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
          {/* =================================================
              CONTENEDOR
          ================================================= */}

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
            {/* ===============================================
                HEADER
            =============================================== */}

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

              {/* =============================================
                  CERRAR
              ============================================= */}

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

            {/* ===============================================
                CONTENIDO
            =============================================== */}

            <div
              style={{
                maxHeight:
                  "calc(80vh - 100px)",
                overflowY: "auto",
                padding: "0 24px 20px",
              }}
            >
              {/* =============================================
                  LOADING
              ============================================= */}

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

              {/* =============================================
                  ERROR
              ============================================= */}

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

              {/* =============================================
                  SIN CARRERAS
              ============================================= */}

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

              {/* =============================================
                  LISTADO
              ============================================= */}

              {!loading &&
                !error &&
                sortedRides.length > 0 && (
                  <div>
                    {/* ---------------------------------------
                        CABECERA DE COLUMNAS
                    --------------------------------------- */}

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

                    {/* ---------------------------------------
                        CARRERAS ORDENADAS
                    --------------------------------------- */}

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