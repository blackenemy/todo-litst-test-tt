import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/card";
import { Input } from "../../components/input";
import { Table } from "../../components/table";
import Badge from "../../components/badge/badge";
import { useStatusContext } from "../../context";
import { initialTodos, type TodoItem } from "../../context/initialTodos";
import type { TableColumn } from "../../components/table";
import type { BadgeVariant } from "../../components/badge";
import styles from "./todo-lists.module.css";

export default function TodoListsPage() {
  const navigate = useNavigate();
  const { updateStatus } = useStatusContext();
  const [todos, setTodos] = React.useState<TodoItem[]>(initialTodos);
  const [searchQuery, setSearchQuery] = React.useState("");

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

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Todo Lists</h1>
      <p className={styles.subtitle}>Manage your todos with ease</p>

      <div className={styles.searchWrapper}>
        <Input
          placeholder="Search todos by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          helperText={`Found ${filteredTodos.length} of ${todos.length} todos`}
        />
      </div>

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
                onToggle={(checked: boolean) => {
                  updateStatus(String(todo.id), checked);
                  setTodos((prevTodos) =>
                    prevTodos.map((t) =>
                      t.id === todo.id ? { ...t, completed: checked } : t
                    )
                  );
                }}
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
