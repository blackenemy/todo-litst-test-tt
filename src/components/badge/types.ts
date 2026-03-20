import type { ComponentPropsWithoutRef } from "react";

export type BadgeVariant = "completed" | "pending" | "default";

export interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  variant?: BadgeVariant;
  label?: string;
}
