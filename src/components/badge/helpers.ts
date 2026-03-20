import type { BadgeVariant } from "./types";

export const getBadgeVariant = (completed: boolean): BadgeVariant => {
  return completed ? "completed" : "pending";
};

export const getBadgeLabel = (completed: boolean): string => {
  return completed ? "Completed" : "Pending";
};

export const getBackgroundColor = (variant: BadgeVariant): string => {
  const colors: Record<BadgeVariant, string> = {
    completed: "#d1fae5",
    pending: "#fef3c7",
    default: "#f3f4f6",
  };
  return colors[variant];
};

export const getTextColor = (variant: BadgeVariant): string => {
  const colors: Record<BadgeVariant, string> = {
    completed: "#065f46",
    pending: "#92400e",
    default: "#374151",
  };
  return colors[variant];
};

export const getBorderColor = (variant: BadgeVariant): string => {
  const colors: Record<BadgeVariant, string> = {
    completed: "#a7f3d0",
    pending: "#fcd34d",
    default: "#e5e7eb",
  };
  return colors[variant];
};
