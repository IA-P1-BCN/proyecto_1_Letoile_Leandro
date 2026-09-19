"use client";

type TaximeterProps = {
  amount: number;
  status: "idle" | "moving" | "stopped";
};

const statusConfig = {
  idle: {
    label: "LISTO",
    color: "#facc15",
    rate: "0,02 €/s",
  },
  moving: {
    label: "EN MARCHA",
    color: "#22c55e",
    rate: "0,05 €/s",
  },
  stopped: {
    label: "DETENIDO",
    color: "#f97316",
    rate: "0,02 €/s",
  },
};

export default function Taximeter({
  amount,
  status,
}: TaximeterProps) {
  const currentStatus =
    status === "moving"
      ? statusConfig.moving
      : status === "stopped"
        ? statusConfig.stopped
        : statusConfig.idle;

  const progressWidth =
    status === "moving"
      ? "72%"
      : status === "stopped"
        ? "38%"
        : "12%";

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 100,
        width: "250px",
        padding: "18px",
        borderRadius: "18px",
        background:
          "linear-gradient(145deg, rgba(15, 23, 42, 0.97), rgba(2, 6, 23, 0.94))",
        border: "1px solid rgba(255, 255, 255, 0.14)",
        boxShadow:
          "0 20px 50px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        color: "white",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        pointerEvents: "none",
        backdropFilter: "blur(14px)",
        overflow: "hidden",
      }}
    >
      {/* Barra superior de estado */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: currentStatus.color,
          boxShadow: `0 0 12px ${currentStatus.color}`,
          opacity: status === "idle" ? 0.7 : 1,
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "2.5px",
              color: "rgba(255, 255, 255, 0.55)",
            }}
          >
            TAXÍMETRO
          </div>

          <div
            style={{
              fontSize: "9px",
              fontWeight: 600,
              letterSpacing: "1.5px",
              color: "rgba(255, 255, 255, 0.3)",
              marginTop: "3px",
            }}
          >
            TAXITECH SYSTEM
          </div>
        </div>

        {/* Indicador online */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "1px",
            color: "rgba(255, 255, 255, 0.45)",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: currentStatus.color,
              boxShadow: `0 0 10px ${currentStatus.color}`,
            }}
          />

          ONLINE
        </div>
      </div>

      {/* Importe actual */}
      <div
        style={{
          padding: "16px",
          borderRadius: "12px",
          background: "rgba(255, 255, 255, 0.035)",
          border: "1px solid rgba(255, 255, 255, 0.07)",
          marginBottom: "14px",
        }}
      >
        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "1.5px",
            color: "rgba(255, 255, 255, 0.35)",
            marginBottom: "7px",
          }}
        >
          IMPORTE ACTUAL
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "7px",
          }}
        >
          <span
            style={{
              fontSize: "40px",
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-1.5px",
              color: "white",
              textShadow:
                "0 0 20px rgba(255, 255, 255, 0.08)",
            }}
          >
            {amount.toFixed(2).replace(".", ",")}
          </span>

          <span
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "rgba(255, 255, 255, 0.45)",
            }}
          >
            €
          </span>
        </div>
      </div>

      {/* Estado y tarifa */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              width: "9px",
              height: "9px",
              borderRadius: "50%",
              background: currentStatus.color,
              boxShadow: `0 0 10px ${currentStatus.color}`,
            }}
          />

          <span
            style={{
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.8px",
              color: currentStatus.color,
            }}
          >
            {currentStatus.label}
          </span>
        </div>

        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "rgba(255, 255, 255, 0.45)",
          }}
        >
          {currentStatus.rate}
        </div>
      </div>

      {/* Barra de progreso */}
      <div
        style={{
          marginTop: "16px",
          height: "3px",
          borderRadius: "999px",
          background: "rgba(255, 255, 255, 0.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: progressWidth,
            height: "100%",
            borderRadius: "999px",
            background: currentStatus.color,
            boxShadow: `0 0 8px ${currentStatus.color}`,
            transition: "all 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}