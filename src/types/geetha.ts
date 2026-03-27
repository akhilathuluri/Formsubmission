export interface GeethaSubmission {
  id: number;
  selectedOptionIds: string[];
  requestedMinutes: number;
  deductedMinutes: number;
  remainingMinutesAfter: number;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface GeethaDashboardResponse {
  totalMinutes: number;
  remainingMinutes: number;
  submissions: GeethaSubmission[];
}
