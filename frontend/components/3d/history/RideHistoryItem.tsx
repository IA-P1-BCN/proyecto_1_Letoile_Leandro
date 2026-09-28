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
  return `${amount.toFixed(2).replace(".", ",")} €`;
}

export default function RideHistoryItem({
  ride,
}: RideHistoryItemProps) {
  return (
    <div className="ride-history-row">
      <div className="ride-history-id">
        <span>#</span>
        {ride.ride_id}
      </div>

      <div className="ride-history-date">
        <strong>
          {formatDate(ride.started_at)}
        </strong>

        <span>
          Inicio del viaje
        </span>
      </div>

      <div className="ride-history-duration">
        <span className="ride-history-duration-icon">
          ◷
        </span>

        <span>
          {formatDuration(
            ride.stopped_time,
            ride.moving_time
          )}
        </span>
      </div>

      <div className="ride-history-total">
        {formatAmount(ride.total)}
      </div>
    </div>
  );
}