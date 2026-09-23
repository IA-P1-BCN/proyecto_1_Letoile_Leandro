"use client";

import type { RideResponse } from "../../../lib/api/taximeter";

type RideHistoryItemProps = {
  ride: RideResponse;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(
  stoppedTime: number,
  movingTime: number
): string {
  const totalSeconds = Math.round(
    stoppedTime + movingTime
  );

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function formatAmount(amount: number): string {
  return `${amount.toFixed(2)} €`;
}

export default function RideHistoryItem({
  ride,
}: RideHistoryItemProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "50px minmax(180px, 1fr) 100px 100px",
        gap: "12px",
        alignItems: "center",
        padding: "14px 0",
        borderBottom:
          "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* ID */}
      <span
        style={{
          color: "#8da2b8",
          fontSize: "13px",
        }}
      >
        #{ride.ride_id}
      </span>

      {/* Fecha */}
      <div>
        <div
          style={{
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {formatDate(ride.started_at)}
        </div>
      </div>

      {/* Duración */}
      <span
        style={{
          color: "#8da2b8",
          fontSize: "13px",
        }}
      >
        {formatDuration(
          ride.stopped_time,
          ride.moving_time
        )}
      </span>

      {/* Total */}
      <span
        style={{
          color: "#ffffff",
          fontSize: "14px",
          fontWeight: 700,
          textAlign: "right",
        }}
      >
        {formatAmount(ride.total)}
      </span>
    </div>
  );
}