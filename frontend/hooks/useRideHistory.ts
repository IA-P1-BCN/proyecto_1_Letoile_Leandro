"use client";

import { useCallback, useEffect, useState } from "react";
import { getRideHistory, type RideResponse } from "../lib/api/taximeter";

type UseRideHistoryResult = {
  rides: RideResponse[];
  loading: boolean;
  error: string | null;
  refreshHistory: () => Promise<void>;
};

export default function useRideHistory(): UseRideHistoryResult {
  const [rides, setRides] = useState<RideResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const history = await getRideHistory();

      setRides(history);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo cargar el historial";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  return {
    rides,
    loading,
    error,
    refreshHistory,
  };
}