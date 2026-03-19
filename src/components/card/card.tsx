import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import type { CardProps } from "./types";
import styles from "./card.module.css";

export const Card: React.FC<CardProps> = ({
  title,
  description,
  completed = false,
  onToggle,
}) => {
  const [isChecked, setIsChecked] = React.useState(completed);

  const handleCheckedChange = (checked: boolean) => {
    setIsChecked(checked);
    onToggle?.(checked);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <CheckboxPrimitive.Root
          className={styles.checkboxRoot}
          checked={isChecked}
          onCheckedChange={handleCheckedChange}
        >
          <CheckboxPrimitive.Indicator className={styles.checkboxIndicator}>
            <CheckIcon />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
      </div>
      {description && <p className={styles.cardDescription}>{description}</p>}
    </div>
  );
};
