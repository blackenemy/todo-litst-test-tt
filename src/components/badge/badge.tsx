import * as React from "react";
import type { BadgeProps } from "./types";
import { getBadgeLabel } from "./helpers";
import styles from "./badge.module.css";

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  label,
  className,
  ...rest
}) => {
  const displayLabel = label || getBadgeLabel(variant === "completed");

  return (
    <span
      className={`${styles.root}${className ? ` ${className}` : ""}`}
      data-variant={variant}
      {...rest}
    >
      <span className={styles.icon}>
        {variant === "completed"}
        {variant === "pending"}
        {variant === "default"}
      </span>
      {displayLabel}
    </span>
  );
};

export default Badge;
