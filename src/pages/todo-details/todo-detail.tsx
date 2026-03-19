import * as React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Button } from "../../components/button";
import { useTodoContext, useStatusContext } from "../../context";
import type { Todo } from "../../api/todo/types";
import styles from "./todo-detail.module.css";
import { Input } from "../../components/input";
import { Textarea } from "../../components/textarea";

interface LocationState {
  todo: Todo;
  mode?: "view" | "edit";
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
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
  const { todos, isLoading, updateTodo, updateStatus } = useTodoContext();
  const statusContext = useStatusContext();

  const [todo, setTodo] = React.useState<Todo | null>(state?.todo || null);
  const [mode, setMode] = React.useState<"view" | "edit">(
    state?.mode || "view"
  );
  const [formData, setFormData] = React.useState<Todo | null>(todo);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (!todo && id) {
      const foundTodo = todos.find((t: Todo) => t.id === id);
      if (foundTodo) {
        setTodo(foundTodo);
      }
    }
  }, [id, todo, todos]);

  React.useEffect(() => {
    if (todo) {
      setFormData(todo);
    }
  }, [todo]);

  const handleEdit = () => {
    setMode("edit");
    setFormData({ ...todo! });
  };

  const handleCancel = () => {
    setMode("view");
    setFormData(null);
  };

  const handleSave = async () => {
    if (formData) {
      setIsSaving(true);
      const updatedTodo = await updateTodo(formData.id, {
        title: formData.title,
        description: formData.description,
        completed: formData.completed,
      });
      setIsSaving(false);

      if (updatedTodo) {
        setTodo(updatedTodo);
        setMode("view");
      }
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
      updateStatus(todo?.id || "", checked);
    }
  };

  const statusHistory = todo ? statusContext.getHistoryForTodo(todo.id) : [];

  if (isLoading && !todo) {
    return (
      <div className={styles.container}>
        <Button variant="secondary" onClick={() => navigate("/todos")}>
          <ArrowLeftIcon className={styles.icon} />
          Back
        </Button>
        <div className={styles.skeletonContainer}>
          <Skeleton height={40} width={300} />
          <Skeleton height={24} width={150} />
          <Skeleton height={20} width={200} />
          <Skeleton height={20} width={180} />
          <Skeleton height={20} width={220} />
        </div>
      </div>
    );
  }

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
      <div className={styles.backToList}>
        <Button variant="secondary" onClick={() => navigate("/todos")}>
          <ArrowLeftIcon className={styles.icon} />
          Back to List
        </Button>
      </div>

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
              <h2 className={styles.sectionTitle}>Status</h2>
              <p className={styles.sectionContent}>
                {todo.completed ? "Completed" : "Pending"}
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

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Status History</h2>
              {statusHistory.length > 0 ? (
                <div className={styles.historyList}>
                  {statusHistory.map(
                    (
                      entry: {
                        id: string;
                        completed: boolean;
                        timestamp: number;
                      },
                      index: number
                    ) => (
                      <div key={index} className={styles.historyItem}>
                        <div className={styles.historyIcon}>
                          {entry.completed ? (
                            <span className={styles.completedIcon}>✓</span>
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
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )
                  )}
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
            <div className={styles.formGroup}>
              <Input
                label="Title"
                id="title"
                name="title"
                type="text"
                placeholder="Enter todo title"
                value={formData?.title || ""}
                onChange={handleChange}
                required
                isRequired
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <Textarea
                label="Description"
                id="description"
                name="description"
                placeholder="Enter description"
                value={formData?.description || ""}
                onChange={handleChange}
                rows={4}
                className={styles.textarea}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel} htmlFor="completed">
                <input
                  type="checkbox"
                  id="completed"
                  name="completed"
                  className={styles.checkbox}
                  checked={formData?.completed || false}
                  onChange={(e) => handleStatusChange(e.target.checked)}
                />
                <span>Mark as completed</span>
              </label>
            </div>

            <div className={styles.actions}>
              <Button variant="primary" type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
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
