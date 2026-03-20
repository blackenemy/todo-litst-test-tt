import { useState } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import type { CardProps } from "./types";
import styles from "./card.module.css";

function Card({
  isLoading,
  title,
  description,
  completed = false,
  subtasks,
  onToggle,
  onSubtaskToggle,
}: CardProps) {
  const [isChecked, setIsChecked] = useState(completed);
  const [isSubtasksExpanded, setIsSubtasksExpanded] = useState(false);

  const handleCheckedChange = (checked: boolean) => {
    setIsChecked(checked);
    onToggle?.(checked);
  };

  const handleSubtaskToggle = (subtaskId: string, completed: boolean) => {
    onSubtaskToggle?.(subtaskId, completed);
  };

  if (isLoading) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <Skeleton height={24} width="60%" />
          <Skeleton circle width={20} height={20} />
        </div>
        <Skeleton height={16} width="90%" />
        <Skeleton height={16} width="40%" />
      </div>
    );
  }

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

      {subtasks && subtasks.length > 0 && (
        <div className={styles.subtasksSection}>
          <button
            className={styles.subtasksToggle}
            onClick={() => setIsSubtasksExpanded(!isSubtasksExpanded)}
          >
            {isSubtasksExpanded ? (
              <ChevronDownIcon className={styles.toggleIcon} />
            ) : (
              <ChevronRightIcon className={styles.toggleIcon} />
            )}
            <span>Subtasks ({subtasks.length})</span>
          </button>

          {isSubtasksExpanded && (
            <div className={styles.subtasksList}>
              {subtasks.map((subtask) => (
                <div key={subtask.id} className={styles.subtask}>
                  <div className={styles.subtaskHeader}>
                    <CheckboxPrimitive.Root
                      className={styles.subtaskCheckboxRoot}
                      checked={subtask.completed}
                      onCheckedChange={(checked) =>
                        handleSubtaskToggle(subtask.id, checked as boolean)
                      }
                    >
                      <CheckboxPrimitive.Indicator
                        className={styles.checkboxIndicator}
                      >
                        <CheckIcon />
                      </CheckboxPrimitive.Indicator>
                    </CheckboxPrimitive.Root>
                    <span className={styles.subtaskTitle}>{subtask.title}</span>
                  </div>

                  {subtask.actions && subtask.actions.length > 0 && (
                    <div className={styles.actionsList}>
                      {subtask.actions.map((action) => (
                        <div key={action.id} className={styles.action}>
                          <span className={styles.actionTitle}>
                            {action.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Card;
