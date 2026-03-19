import * as React from "react";
import { SparklesIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "../button";
import { Input } from "../input";
import type { ExpandTaskFormProps } from "./types";
import { getTaskPreview } from "../../utils/taskExpander";
import type { TodoItem } from "../../context/initialTodos";
import styles from "./expand-task-form.module.css";

function ExpandTaskForm({ onTaskExpanded }: ExpandTaskFormProps) {
  const [keyword, setKeyword] = React.useState("");
  const [preview, setPreview] = React.useState<TodoItem | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleExpand = () => {
    if (!keyword.trim()) {
      setError("Please enter a keyword");
      setPreview(null);
      return;
    }

    const result = getTaskPreview(keyword);

    if (result.success) {
      setPreview(result.todo);
      setError(null);
    } else {
      setPreview(null);
      setError(
        `No template found for "${keyword}". Available keywords: user authentication, database setup, api integration`
      );
    }
  };

  const handleConfirm = () => {
    if (preview) {
      onTaskExpanded(preview);
      setKeyword("");
      setPreview(null);
      setError(null);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setError(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <SparklesIcon className={styles.icon} />
        <h2 className={styles.title}>Expand Task from Template</h2>
      </div>

      <div className={styles.inputGroup}>
        <div className={styles.inputWrapper}>
          <Input
            placeholder="Enter keyword (e.g., user authentication, database setup, api integration)..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !preview) {
                handleExpand();
              }
            }}
            disabled={!!preview}
          />
        </div>
        <div className={styles.buttonGroup}>
          <Button onClick={handleExpand} disabled={!!preview}>
            Expand
          </Button>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <p className={styles.errorText}>{error}</p>
        </div>
      )}

      {preview && (
        <div className={styles.preview}>
          <h3 className={styles.previewTitle}>{preview.title}</h3>
          <p className={styles.previewDescription}>{preview.description}</p>

          {preview.subtasks && preview.subtasks.length > 0 && (
            <div className={styles.previewSubtasks}>
              {preview.subtasks.map((subtask) => (
                <div key={subtask.id} className={styles.previewSubtask}>
                  <h4 className={styles.previewSubtaskTitle}>
                    {subtask.title}
                  </h4>
                  <div className={styles.previewActions}>
                    {subtask.actions.map((action) => (
                      <p key={action.id} className={styles.previewAction}>
                        {action.title}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={styles.actionButtons}>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              <CheckCircleIcon className={styles.icon} />
              Confirm & Add to List
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpandTaskForm;
