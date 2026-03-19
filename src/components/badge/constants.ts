import type { BadgeVariant } from "./types";

export const BADGE_VARIANT_COLORS: Record<BadgeVariant, string> = {
  completed: "#10b981",
  pending: "#f59e0b",
  default: "#6b7280",
} as const;

export const BADGE_VARIANT_LABELS: Record<BadgeVariant, string> = {
  completed: "Completed",
  pending: "Pending",
  default: "Unknown",
} as const;
