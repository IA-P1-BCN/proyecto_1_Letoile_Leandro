const API_URL = "http://localhost:8000";

export type TaximeterState = {
  state: "idle" | "stopped" | "moving" | "finished";
};

export type TaximeterCurrent = {
  state: "idle" | "stopped" | "moving" | "finished";
  stopped_time: number;
  moving_time: number;
  stopped_cost: number;
  moving_cost: number;
  total: number;
};

export type ActionResponse = {
  success: boolean;
  message: string;
};

export type RideResponse = {
  ride_id: number;
  started_at: string;
  finished_at: string;
  stopped_time: number;
  moving_time: number;
  stopped_cost: number;
  moving_cost: number;
  total: number;
};

export type RideFinishResponse = {
  success: boolean;
  ride_id: number;
  started_at: string;
  finished_at: string;
  stopped_time: number;
  moving_time: number;
  stopped_cost: number;
  moving_cost: number;
  total: number;
};

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,

    credentials: "include",

    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let message = "Error en la API";

    try {
      const error = await response.json();

      if (typeof error.detail === "string") {
        message = error.detail;
      }
    } catch {
      // Mantener mensaje genérico
    }

    throw new Error(message);
  }

  return response.json();
}

export async function getTaximeterState(): Promise<TaximeterState> {
  return request<TaximeterState>("/api/taximeter/state");
}

export async function getTaximeterCurrent(): Promise<TaximeterCurrent> {
  return request<TaximeterCurrent>("/api/taximeter/current");
}

export async function startRide(): Promise<ActionResponse> {
  return request<ActionResponse>("/api/rides/start", {
    method: "POST",
  });
}

export async function moveRide(): Promise<ActionResponse> {
  return request<ActionResponse>("/api/rides/move", {
    method: "POST",
  });
}

export async function stopRide(): Promise<ActionResponse> {
  return request<ActionResponse>("/api/rides/stop", {
    method: "POST",
  });
}

export async function finishRide(): Promise<RideFinishResponse> {
  return request<RideFinishResponse>("/api/rides/finish", {
    method: "POST",
  });
}

export async function getRideHistory(): Promise<RideResponse[]> {
  return request<RideResponse[]>("/api/rides/history");
}