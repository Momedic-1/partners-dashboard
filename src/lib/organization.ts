import type { User } from "@/AuthContext";

/** Organization id for API calls. Falls back to admin id when production omits organizationId. */
export function getOrganizationId(user: User | null | undefined): number | null {
  if (!user) return null;
  const raw = user.organizationId ?? user.id;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function formatSpecialty(value: string): string {
  if (!value) return "—";
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Backend contract (OrganizationReportService):
 * - GP video calls: "pending" (active) | "completed" (ended)
 * - Specialist slots: "pending" | "completed" | "cancelled"
 */
export type ConsultationStatus = "completed" | "pending" | "cancelled";

export const BACKEND_CONSULTATION_STATUSES = [
  "pending",
  "completed",
  "cancelled",
] as const;

export function normalizeConsultationStatus(status: string): ConsultationStatus {
  const s = (status || "").toLowerCase().trim().replace(/\s+/g, "_");

  if (s === "completed" || s === "complete") return "completed";
  if (s === "cancelled" || s === "canceled") return "cancelled";
  if (
    s === "pending" ||
    s === "in_progress" ||
    s === "in-progress" ||
    s === "scheduled"
  ) {
    return "pending";
  }

  return "pending";
}

export function statusLabel(status: ConsultationStatus): string {
  switch (status) {
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return "Pending";
  }
}
