import * as React from "react";
import { useNavigate } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Card } from "../../components/card";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Textarea } from "../../components/textarea";
import { Table } from "../../components/table";
import Badge from "../../components/badge/badge";
import ExpandTaskForm from "../../components/expand-task-form";
import { useStatusContext } from "../../context";
import { initialTodos, type TodoItem, type TodoPriority } from "../../context/initialTodos";
import type { TableColumn } from "../../components/table";
import type { BadgeVariant } from "../../components/badge";
import styles from "./todo-lists.module.css";

export default function TodoListsPage() {
  const navigate = useNavigate();
  const { updateStatus } = useStatusContext();
  const [todos, setTodos] = React.useState<TodoItem[]>(initialTodos);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isCreateFormVisible, setIsCreateFormVisible] = React.useState(false);
  const [newTodoTitle, setNewTodoTitle] = React.useState("");
  const [newTodoDescription, setNewTodoDescription] = React.useState("");
  const [newTodoPriority, setNewTodoPriority] = React.useState<TodoPriority | "">("");
  const [newTodoDueDate, setNewTodoDueDate] = React.useState("");
  const [titleError, setTitleError] = React.useState("");

  const filteredTodos = todos.filter(
    (todo) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.description &&
        todo.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const columns: TableColumn[] = [
    { key: "id", label: "ID", position: "left" },
    { key: "title", label: "Title", position: "middle" },
    {
      key: "description",
      label: "Description",
      position: "middle",
      render: (value: unknown): React.ReactNode => (value as string) || "-",
    },
    {
      key: "completed",
      label: "Status",
      position: "middle",
      render: (value: unknown): React.ReactNode => {
        const isCompleted = value as boolean;
        const variant: BadgeVariant = isCompleted ? "completed" : "pending";
        return <Badge variant={variant} />;
      },
    },
  ];

  const handleView = (rowData: Record<string, unknown>) => {
    const todo = rowData as unknown as TodoItem;
    navigate(`/todo/${todo.id}`, { state: { todo, mode: "view" } });
  };

  const handleEdit = (rowData: Record<string, unknown>) => {
    const todo = rowData as unknown as TodoItem;
    navigate(`/todo/${todo.id}`, { state: { todo, mode: "edit" } });
  };

  const handleDelete = (rowData: Record<string, unknown>) => {
    const todo = rowData as unknown as TodoItem;
    if (window.confirm(`Are you sure you want to delete "${todo.title}"?`)) {
      setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
    }
  };

  const handleCreateTodo = () => {
    if (!newTodoTitle.trim()) {
      setTitleError("Title is required");
      return;
    }

    const now = Date.now();
    const newTodo: TodoItem = {
      id: Math.max(...todos.map((t) => t.id), 0) + 1,
      title: newTodoTitle.trim(),
      description: newTodoDescription.trim() || undefined,
      completed: false,
      priority: newTodoPriority || undefined,
      dueDate: newTodoDueDate ? new Date(newTodoDueDate).getTime() : undefined,
      createdAt: now,
      updatedAt: now,
    };

    setTodos((prevTodos) => [newTodo, ...prevTodos]);
    setIsCreateFormVisible(false);
    setNewTodoTitle("");
    setNewTodoDescription("");
    setNewTodoPriority("");
    setNewTodoDueDate("");
    setTitleError("");
  };

  const handleCancelCreate = () => {
    setIsCreateFormVisible(false);
    setNewTodoTitle("");
    setNewTodoDescription("");
    setNewTodoPriority("");
    setNewTodoDueDate("");
    setTitleError("");
  };

  const handleTaskExpanded = (expandedTodo: TodoItem) => {
    const newTodo: TodoItem = {
      ...expandedTodo,
      id: Math.max(...todos.map((t) => t.id), 0) + 1,
    };
    setTodos((prevTodos) => [newTodo, ...prevTodos]);
  };

  const handleSubtaskToggle = (todoId: number, subtaskId: string, completed: boolean) => {
    setTodos((prevTodos) =>
      prevTodos.map((t) =>
        t.id === todoId
          ? {
              ...t,
              subtasks: t.subtasks?.map((st) =>
                st.id === subtaskId ? { ...st, completed } : st
              ),
            }
          : t
      )
    );
  };

  const handleActionToggle = (todoId: number, subtaskId: string, actionId: string, completed: boolean) => {
    setTodos((prevTodos) =>
      prevTodos.map((t) =>
        t.id === todoId
          ? {
              ...t,
              subtasks: t.subtasks?.map((st) =>
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
          : t
      )
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Todo Lists</h1>
          <p className={styles.subtitle}>Manage your todos with ease</p>
        </div>
      </div>

      <div className={styles.searchWrapper}>
        <div className={styles.searchBar}>
          <div className={styles.searchInputWrapper}>
            <Input
              placeholder="Search todos by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              helperText={`Found ${filteredTodos.length} of ${todos.length} todos`}
            />
          </div>
          <Button
            onClick={() => setIsCreateFormVisible(!isCreateFormVisible)}
            className={styles.createButton}
          >
            <PlusIcon className={styles.buttonIcon} />
            Create Todo
          </Button>
        </div>

        {isCreateFormVisible && (
          <div className={styles.createForm}>
            <Input
              label="Title"
              isRequired
              placeholder="Enter todo title..."
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              error={titleError}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateTodo();
                if (e.key === "Escape") handleCancelCreate();
              }}
            />
            
            <Textarea
              label="Description"
              placeholder="Enter todo description (optional)..."
              value={newTodoDescription}
              onChange={(e) => setNewTodoDescription(e.target.value)}
              className={styles.descriptionInput}
              onKeyDown={(e) => {
                if (e.key === "Escape") handleCancelCreate();
              }}
            />

            <div className={styles.priorityWrapper}>
              <label className={styles.priorityLabel}>Priority (optional)</label>
              <div className={styles.priorityOptions}>
                <label className={styles.priorityOption}>
                  <input
                    type="radio"
                    name="priority"
                    value="low"
                    checked={newTodoPriority === "low"}
                    onChange={(e) => setNewTodoPriority(e.target.value as TodoPriority)}
                  />
                  <span className={styles.priorityText}>Low</span>
                </label>
                <label className={styles.priorityOption}>
                  <input
                    type="radio"
                    name="priority"
                    value="medium"
                    checked={newTodoPriority === "medium"}
                    onChange={(e) => setNewTodoPriority(e.target.value as TodoPriority)}
                  />
                  <span className={styles.priorityText}>Medium</span>
                </label>
                <label className={styles.priorityOption}>
                  <input
                    type="radio"
                    name="priority"
                    value="high"
                    checked={newTodoPriority === "high"}
                    onChange={(e) => setNewTodoPriority(e.target.value as TodoPriority)}
                  />
                  <span className={styles.priorityText}>High</span>
                </label>
              </div>
            </div>

            <Input
              label="Due Date (optional)"
              type="date"
              value={newTodoDueDate}
              onChange={(e) => setNewTodoDueDate(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") handleCancelCreate();
              }}
            />

            <div className={styles.formActions}>
              <Button variant="secondary" onClick={handleCancelCreate}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleCreateTodo}>
                Create
              </Button>
            </div>
          </div>
        )}
      </div>

      <ExpandTaskForm onTaskExpanded={handleTaskExpanded} />

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Card View</h2>
        <div className={styles.cardViewContainer}>
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <Card
                key={todo.id}
                title={todo.title}
                description={todo.description}
                completed={todo.completed}
                subtasks={todo.subtasks}
                onToggle={(checked: boolean) => {
                  updateStatus(String(todo.id), checked);
                  setTodos((prevTodos) =>
                    prevTodos.map((t) =>
                      t.id === todo.id ? { ...t, completed: checked } : t
                    )
                  );
                }}
                onSubtaskToggle={(subtaskId: string, completed: boolean) =>
                  handleSubtaskToggle(todo.id, subtaskId, completed)
                }
                onActionToggle={(subtaskId: string, actionId: string, completed: boolean) =>
                  handleActionToggle(todo.id, subtaskId, actionId, completed)
                }
              />
            ))
          ) : (
            <p className={styles.emptyMessage}>
              No todos found matching your search.
            </p>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Table View</h2>
        <Table
          columns={columns}
          data={filteredTodos as unknown as Record<string, unknown>[]}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No todos found. Try adjusting your search."
        />
      </div>
    </div>
  );
}
