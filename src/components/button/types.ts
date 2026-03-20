import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "text"
  | "icon";
export type ButtonSize = "sm" | "md" | "lg";
export type IconColor = "view" | "edit" | "delete";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  iconColor?: IconColor;
}
