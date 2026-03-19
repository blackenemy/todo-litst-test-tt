import * as React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/input";
import { Textarea } from "../../components/textarea";
import { Button } from "../../components/button";
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { useStatusContext } from "../../context";
import type { Subtask } from "../../context/initialTodos";
import styles from "./todo-detail.module.css";

interface TodoItem {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  subtasks?: Subtask[];
  createdAt: number;
  updatedAt: number;
}

interface LocationState {
  todo: TodoItem;
  mode?: "view" | "edit";
}

// Helper function to format timestamp to readable date
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function TodoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const { getHistoryForTodo, updateStatus } = useStatusContext();

  const [todo, setTodo] = React.useState<TodoItem | null>(state?.todo || null);
  const [mode, setMode] = React.useState<"view" | "edit">(
    state?.mode || "view"
  );
  const [formData, setFormData] = React.useState<TodoItem | null>(todo);

  React.useEffect(() => {
    if (!todo && id) {
      console.log(`Would fetch todo with id: ${id}`);
    }
  }, [id, todo]);

  const handleEdit = () => {
    setMode("edit");
    setFormData({ ...todo! });
  };

  const handleCancel = () => {
    setMode("view");
    setFormData(null);
  };

  const handleSave = () => {
    if (formData) {
      const updatedTodo = {
        ...formData,
        updatedAt: Date.now(),
      };
      setTodo(updatedTodo);
      setMode("view");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : value,
          }
        : null
    );
  };

  const handleStatusChange = (checked: boolean) => {
    if (formData) {
      setFormData((prev) =>
        prev
          ? {
              ...prev,
              completed: checked,
            }
          : null
      );
      // Track status change in context
      updateStatus(String(todo?.id), checked);
    }
  };

  const handleSubtaskToggle = (subtaskId: string, completed: boolean) => {
    if (todo) {
      setTodo((prev) =>
        prev
          ? {
              ...prev,
              subtasks: prev.subtasks?.map((st) =>
                st.id === subtaskId ? { ...st, completed } : st
              ),
            }
          : null
      );
    }
  };

  const handleActionToggle = (subtaskId: string, actionId: string, completed: boolean) => {
    if (todo) {
      setTodo((prev) =>
        prev
          ? {
              ...prev,
              subtasks: prev.subtasks?.map((st) =>
                st.id === subtaskId
                  ? {
                      ...st,
                      actions: st.actions?.map((action) =>
                        action.id === actionId ? { ...action, completed } : action
                      ),
                    }
                  : st
              ),
            }
          : null
      );
    }
  };

  // Get status history for this todo
  const statusHistory = todo ? getHistoryForTodo(String(todo.id)) : [];

  if (!todo) {
    return (
      <div className={styles.container}>
        <Button variant="secondary" onClick={() => navigate("/todos")}>
          <ArrowLeftIcon className={styles.icon} />
          Back
        </Button>
        <div className={styles.emptyState}>
          <p>Todo not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Button variant="secondary" onClick={() => navigate("/todos")}>
        <ArrowLeftIcon className={styles.icon} />
        Back to List
      </Button>

      {mode === "view" ? (
        <div className={styles.viewMode}>
          <div className={styles.header}>
            <h1 className={styles.title}>{todo.title}</h1>
          </div>

          <div className={styles.content}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>ID</h2>
              <p className={styles.sectionContent}>{todo.id}</p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Description</h2>
              <p className={styles.sectionContent}>
                {todo.description || "No description provided"}
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Timestamps</h2>
              <div className={styles.timestamps}>
                <div className={styles.timestampItem}>
                  <span className={styles.label}>Created:</span>
                  <span className={styles.value}>
                    {formatDate(todo.createdAt)}
                  </span>
                </div>
                <div className={styles.timestampItem}>
                  <span className={styles.label}>Last Updated:</span>
                  <span className={styles.value}>
                    {formatDate(todo.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            {todo.subtasks && todo.subtasks.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Subtasks</h2>
                <div className={styles.subtasksList}>
                  {todo.subtasks.map((subtask) => (
                    <div key={subtask.id} className={styles.subtask}>
                      <div className={styles.subtaskHeader}>
                        <CheckboxPrimitive.Root
                          className={styles.subtaskCheckbox}
                          checked={subtask.completed}
                          onCheckedChange={(checked) =>
                            handleSubtaskToggle(subtask.id, checked as boolean)
                          }
                        >
                          <CheckboxPrimitive.Indicator />
                        </CheckboxPrimitive.Root>
                        <span className={styles.subtaskTitle}>{subtask.title}</span>
                      </div>
                      {subtask.actions && subtask.actions.length > 0 && (
                        <div className={styles.actionsList}>
                          {subtask.actions.map((action) => (
                            <div key={action.id} className={styles.action}>
                              <CheckboxPrimitive.Root
                                className={styles.actionCheckbox}
                                checked={action.completed}
                                onCheckedChange={(checked) =>
                                  handleActionToggle(subtask.id, action.id, checked as boolean)
                                }
                              >
                                <CheckboxPrimitive.Indicator />
                              </CheckboxPrimitive.Root>
                              <span className={styles.actionTitle}>{action.title}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Status History</h2>
              {statusHistory.length > 0 ? (
                <div className={styles.historyList}>
                  {statusHistory.map((entry, index) => (
                    <div key={index} className={styles.historyItem}>
                      <div className={styles.historyIcon}>
                        {entry.completed ? (
                          <CheckIcon className={styles.completedIcon} />
                        ) : (
                          <span className={styles.pendingIcon}>✕</span>
                        )}
                      </div>
                      <div className={styles.historyContent}>
                        <span className={styles.historyText}>
                          {entry.completed
                            ? "Marked as completed"
                            : "Marked as pending"}
                        </span>
                        <span className={styles.historyTime}>
                          {formatDate(entry.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.sectionContent}>
                  No status changes recorded yet
                </p>
              )}
            </div>
          </div>

          <div className={styles.actions}>
            <Button variant="primary" onClick={handleEdit}>
              Edit
            </Button>
            <Button variant="secondary" onClick={() => navigate("/todos")}>
              Close
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.editMode}>
          <h2 className={styles.editTitle}>Edit Todo</h2>
          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Enter todo title"
              label="Title"
              value={formData?.title || ""}
              onChange={handleChange}
              isRequired
            />

            <Textarea
              id="description"
              name="description"
              label="Description"
              placeholder="Enter description"
              value={formData?.description || ""}
              onChange={handleChange}
              rows={4}
            />

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel} htmlFor="completed">
                <CheckboxPrimitive.Root
                  className={styles.checkbox}
                  id="completed"
                  name="completed"
                  checked={formData?.completed || false}
                  onCheckedChange={handleStatusChange}
                >
                  <CheckboxPrimitive.Indicator />
                </CheckboxPrimitive.Root>
                <span>Mark as completed</span>
              </label>
            </div>

            <div className={styles.actions}>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
              <Button variant="secondary" type="button" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
