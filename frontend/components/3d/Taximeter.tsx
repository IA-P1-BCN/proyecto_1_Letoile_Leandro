"use client";

type TaximeterProps = {
  amount: number;

  status:
    | "idle"
    | "moving"
    | "stopped"
    | "finished";
};

const statusConfig = {
  idle: {
    label: "LISTO",
    color: "#facc15",
    rate: "0,02 €/s",
    mode: "STANDBY",
  },

  moving: {
    label: "EN MARCHA",
    color: "#22c55e",
    rate: "0,05 €/s",
    mode: "ACTIVE",
  },

  stopped: {
    label: "DETENIDO",
    color: "#f97316",
    rate: "0,02 €/s",
    mode: "PAUSED",
  },

  finished: {
    label: "FINALIZADO",
    color: "#ef4444",
    rate: "VIAJE CERRADO",
    mode: "COMPLETE",
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
        : status === "finished"
          ? statusConfig.finished
          : statusConfig.idle;

  const progressWidth =
    status === "moving"
      ? "72%"
      : status === "stopped"
        ? "38%"
        : status === "finished"
          ? "100%"
          : "12%";

  const formattedAmount = amount
    .toFixed(2)
    .replace(".", ",");

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 100,
        width: "270px",
        padding: "18px",
        borderRadius: "18px",

        background:
          "linear-gradient(145deg, rgba(10, 23, 39, 0.96), rgba(2, 8, 18, 0.98))",

        border:
          "1px solid rgba(110, 180, 220, 0.16)",

        boxShadow:
          "0 25px 60px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.05)",

        color: "white",

        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",

        pointerEvents: "none",

        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",

        overflow: "hidden",
      }}
    >
      {/* =================================================
          HUD DECORATION
          ================================================= */}

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",

          background:
            `linear-gradient(90deg, transparent, ${currentStatus.color}, transparent)`,

          boxShadow:
            `0 0 14px ${currentStatus.color}`,

          opacity:
            status === "idle" ? 0.55 : 1,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "42px",
          right: "-25px",

          width: "90px",
          height: "90px",

          borderRadius: "50%",

          background:
            `radial-gradient(circle, ${currentStatus.color}18, transparent 70%)`,

          pointerEvents: "none",
        }}
      />

      {/* =================================================
          HEADER
          ================================================= */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",

          marginBottom: "15px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",

              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "2.2px",

              color: "rgba(255, 255, 255, 0.72)",
            }}
          >
            <span
              style={{
                color: "#5fd5ff",
              }}
            >
              TTX
            </span>

            <span
              style={{
                color: "rgba(255,255,255,0.28)",
              }}
            >
              /
            </span>

            247
          </div>

          <div
            style={{
              marginTop: "4px",

              fontSize: "8px",
              fontWeight: 700,
              letterSpacing: "1.8px",

              color: "rgba(255, 255, 255, 0.28)",
            }}
          >
            DIGITAL METER
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",

            padding:
              "5px 8px",

            border:
              "1px solid rgba(255,255,255,0.07)",

            borderRadius: "999px",

            background:
              "rgba(255,255,255,0.025)",

            fontSize: "8px",
            fontWeight: 800,
            letterSpacing: "1.2px",

            color:
              "rgba(255,255,255,0.42)",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",

              borderRadius: "50%",

              background:
                currentStatus.color,

              boxShadow:
                `0 0 9px ${currentStatus.color}`,
            }}
          />

          ONLINE
        </div>
      </div>

      {/* =================================================
          AMOUNT DISPLAY
          ================================================= */}

      <div
        style={{
          position: "relative",

          padding:
            "18px 16px 16px",

          border:
            "1px solid rgba(115, 180, 215, 0.09)",

          borderRadius: "13px",

          background:
            "linear-gradient(145deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012))",

          marginBottom: "14px",

          overflow: "hidden",
        }}
      >
        {/* Scan line */}

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,

            height: "1px",

            background:
              "linear-gradient(90deg, transparent, rgba(100,210,255,0.22), transparent)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            marginBottom: "8px",
          }}
        >
          <span
            style={{
              fontSize: "8px",
              fontWeight: 800,
              letterSpacing: "1.6px",

              color:
                "rgba(255,255,255,0.3)",
            }}
          >
            IMPORTE ACTUAL
          </span>

          <span
            style={{
              fontSize: "8px",
              fontWeight: 700,
              letterSpacing: "1px",

              color:
                currentStatus.color,

              opacity: 0.8,
            }}
          >
            EUR
          </span>
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
              fontSize: "42px",
              fontWeight: 800,

              lineHeight: 1,

              letterSpacing: "-2px",

              color: "#ffffff",

              textShadow:
                `0 0 25px ${currentStatus.color}20`,
            }}
          >
            {formattedAmount}
          </span>

          <span
            style={{
              fontSize: "17px",
              fontWeight: 700,

              color:
                "rgba(255,255,255,0.38)",
            }}
          >
            €
          </span>
        </div>

        {/* Small digital indicators */}

        <div
          style={{
            display: "flex",
            gap: "4px",

            marginTop: "13px",
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7].map(
            (index) => (
              <span
                key={index}
                style={{
                  flex: 1,
                  height: "2px",

                  borderRadius: "999px",

                  background:
                    index <
                    Math.round(
                      (amount % 1) * 8
                    )
                      ? currentStatus.color
                      : "rgba(255,255,255,0.06)",

                  boxShadow:
                    index <
                    Math.round(
                      (amount % 1) * 8
                    )
                      ? `0 0 5px ${currentStatus.color}`
                      : "none",

                  transition:
                    "all 0.25s ease",
                }}
              />
            )
          )}
        </div>
      </div>

      {/* =================================================
          STATUS
          ================================================= */}

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
            gap: "9px",
          }}
        >
          <span
            style={{
              position: "relative",

              display: "block",

              width: "9px",
              height: "9px",

              borderRadius: "50%",

              background:
                currentStatus.color,

              boxShadow:
                `0 0 11px ${currentStatus.color}`,
            }}
          />

          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 800,

                letterSpacing: "0.9px",

                color:
                  currentStatus.color,
              }}
            >
              {currentStatus.label}
            </div>

            <div
              style={{
                marginTop: "2px",

                fontSize: "7px",
                fontWeight: 700,

                letterSpacing: "1.2px",

                color:
                  "rgba(255,255,255,0.25)",
              }}
            >
              {currentStatus.mode}
            </div>
          </div>
        </div>

        <div
          style={{
            textAlign: "right",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,

              color:
                "rgba(255,255,255,0.5)",
            }}
          >
            {currentStatus.rate}
          </div>

          <div
            style={{
              marginTop: "3px",

              fontSize: "7px",
              fontWeight: 700,

              letterSpacing: "1px",

              color:
                "rgba(255,255,255,0.2)",
            }}
          >
            RATE
          </div>
        </div>
      </div>

      {/* =================================================
          ACTIVITY BAR
          ================================================= */}

      <div
        style={{
          marginTop: "15px",

          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontSize: "7px",
            fontWeight: 800,

            letterSpacing: "1px",

            color:
              "rgba(255,255,255,0.2)",
          }}
        >
          ACT
        </span>

        <div
          style={{
            flex: 1,

            height: "3px",

            borderRadius: "999px",

            background:
              "rgba(255,255,255,0.055)",

            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: progressWidth,

              height: "100%",

              borderRadius: "999px",

              background:
                `linear-gradient(90deg, ${currentStatus.color}55, ${currentStatus.color})`,

              boxShadow:
                `0 0 9px ${currentStatus.color}`,

              transition:
                "width 0.4s ease",
            }}
          />
        </div>

        <span
          style={{
            fontSize: "7px",
            fontWeight: 800,

            letterSpacing: "0.8px",

            color:
              "rgba(255,255,255,0.2)",
          }}
        >
          100
        </span>
      </div>

      {/* =================================================
          FOOTER
          ================================================= */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",

          marginTop: "12px",
          paddingTop: "10px",

          borderTop:
            "1px solid rgba(255,255,255,0.05)",

          fontSize: "7px",
          fontWeight: 700,

          letterSpacing: "1.1px",

          color:
            "rgba(255,255,255,0.18)",
        }}
      >
        <span>
          TAXITECH SOLUTIONS
        </span>

        <span>
          SYSTEM READY
        </span>
      </div>
    </div>
  );
}