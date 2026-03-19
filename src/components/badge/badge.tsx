import type { BadgeProps } from "./types";
import { getBadgeLabel } from "./helpers";
import styles from "./badge.module.css";

function Badge({ variant = "default", label, className, ...rest }: BadgeProps) {
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
}

export default Badge;
