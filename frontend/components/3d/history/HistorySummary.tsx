"use client";

type HistorySummaryProps = {
  rideCount: number;
  totalAmount: number;
};

function formatAmount(amount: number): string {
  return `${amount.toFixed(2)} €`;
}

export default function HistorySummary({
  rideCount,
  totalAmount,
}: HistorySummaryProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginTop: "6px",
        color: "#8da2b8",
        fontSize: "13px",
      }}
    >
      <span>
        {rideCount} carrera
        {rideCount !== 1 ? "s" : ""}
      </span>

      <span>·</span>

      <span>
        {formatAmount(totalAmount)}
      </span>
    </div>
  );
}