import * as React from "react";
import type { CheckboxProps } from "./types";
import styles from "./checkbox.module.css";

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  name,
  label,
  checked,
  onChange,
  disabled,
  className,
}) => {
  return (
    <label className={`${styles.checkboxLabel} ${className || ""}`} htmlFor={id}>
      <input
        type="checkbox"
        id={id}
        name={name}
        className={styles.checkbox}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
};
