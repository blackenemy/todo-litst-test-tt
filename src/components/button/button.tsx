import type { ButtonProps } from "./types";
import styles from "./button.module.css";

function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  className,
  iconColor,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[`size-${size}`]} ${
        iconColor ? styles[`icon${iconColor.charAt(0).toUpperCase() + iconColor.slice(1)}`] : ""
      } ${className || ""}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {variant === "icon" ? (
        <span className={styles.iconWrapper}>{children}</span>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
