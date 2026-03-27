import { getDeviceInfo } from "@/lib/deviceInfo";

export interface SubmitPayload {
  selectedOptionIds: string[];
  requestedMinutes: number;
}

export interface SubmitResponse {
  submissionId: number;
  deductedMinutes: number;
  remainingMinutes: number;
  timeCompletedMinutes: number;
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";

export const submitForm = async (payload: SubmitPayload): Promise<SubmitResponse> => {
  const response = await fetch(`${API_BASE}/api/submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      deviceData: getDeviceInfo(),
    }),
  });

  if (!response.ok) {
    if (response.status === 404 && window.location.hostname === "localhost") {
      throw new Error(
        "Local API route not found. Run npm run dev:full (full Vercel runtime), or set VITE_API_BASE_URL to a deployed API.",
      );
    }
    const message = await response.text();
    throw new Error(message || "Failed to submit form");
  }

  return response.json() as Promise<SubmitResponse>;
};
