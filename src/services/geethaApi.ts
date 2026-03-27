import type { GeethaDashboardResponse } from "@/types/geetha";

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";

export const fetchGeethaDashboard = async (): Promise<GeethaDashboardResponse> => {
  const response = await fetch(`${API_BASE}/api/geetha`);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to load Geetha dashboard");
  }

  return response.json() as Promise<GeethaDashboardResponse>;
};
