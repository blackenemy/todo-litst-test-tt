import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PlusIcon } from "@heroicons/react/24/outline";
import Skeleton from "react-loading-skeleton";
import { Card } from "../../components/card";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Textarea } from "../../components/textarea";
import { Table } from "../../components/table";
import { Badge } from "../../components/badge";
import { StatusOption } from "../../components/option";
import type { StatusFilterValue } from "../../components/option";
import { ExpandTaskForm } from "../../components/expand-task-form";
import { Pagination } from "../../components/pagination";
import { Dialog } from "../../components/dialog";
import { useTodoContext, useStatusContext } from "../../context";
import type { TableColumn } from "../../components/table";
import type { BadgeVariant } from "../../components/badge";
import type { Todo } from "../../api/todo/types";
import type { TodoItem } from "../../context/initialTodos";
import styles from "./todo-lists.module.css";

export default function TodoListsPage() {
  const navigate = useNavigate();
  const { updateStatus } = useStatusContext();
  const {
    todos,
    isLoading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    refetch,
  } = useTodoContext();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] =
    React.useState<StatusFilterValue>("all");
  const [isCreateFormVisible, setIsCreateFormVisible] = React.useState(false);
  const [newTodoTitle, setNewTodoTitle] = React.useState("");
  const [newTodoDescription, setNewTodoDescription] = React.useState("");
  const [titleError, setTitleError] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<Todo | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 5;
  const [cardCurrentPage, setCardCurrentPage] = React.useState(1);
  const cardPageSize = 6;

  const filteredTodos = todos.filter((todo: Todo) => {
    const matchesSearch =
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.description &&
        todo.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && todo.completed) ||
      (statusFilter === "pending" && !todo.completed);
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTodos.length / pageSize) || 1;
  const paginatedTodos = React.useMemo(
    () =>
      filteredTodos.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredTodos, currentPage]
  );

  // Card View Pagination
  const filteredCardTodos = React.useMemo(
    () =>
      filteredTodos
        .filter((todo: Todo) => !todo.completed)
        .slice(
          (cardCurrentPage - 1) * cardPageSize,
          cardCurrentPage * cardPageSize
        ),
    [filteredTodos, cardCurrentPage]
  );
  const cardTotalPages =
    Math.ceil(
      filteredTodos.filter((todo: Todo) => !todo.completed).length /
        cardPageSize
    ) || 1;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

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
    const todo = rowData as unknown as Todo;
    navigate(`/todo/${todo.id}`, { state: { todo, mode: "view" } });
  };

  const handleEdit = (rowData: Record<string, unknown>) => {
    const todo = rowData as unknown as Todo;
    navigate(`/todo/${todo.id}`, { state: { todo, mode: "edit" } });
  };

  const handleDelete = (rowData: Record<string, unknown>) => {
    setDeleteTarget(rowData as unknown as Todo);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      const res = await deleteTodo(deleteTarget.id);
      if (res) {
        toast.success("Todo deleted successfully!");
      } else {
        toast.error("Failed to delete todo. Please try again.");
      }
      setDeleteTarget(null);
    }
  };

  const handleCreateTodo = async () => {
    if (!newTodoTitle.trim()) {
      setTitleError("Title is required");
      return;
    }

    setIsCreating(true);
    const newTodo = await createTodo({
      title: newTodoTitle.trim(),
      description: newTodoDescription.trim() || undefined,
      completed: false,
    });

    setIsCreating(false);

    if (newTodo) {
      setIsCreateFormVisible(false);
      setNewTodoTitle("");
      setNewTodoDescription("");
      setTitleError("");
      toast.success("Task created successfully!");
    }
  };

  const handleCancelCreate = () => {
    toast.success("Task creation canceled.");
    setIsCreateFormVisible(false);
    setNewTodoTitle("");
    setNewTodoDescription("");
    setTitleError("");
  };

  const handleTaskExpanded = async (expandedTodo: TodoItem) => {
    await createTodo({
      title: expandedTodo.title,
      description: expandedTodo.description,
      completed: expandedTodo.completed || false,
      subtasks: expandedTodo.subtasks,
    });
    toast.success("Task created successfully!");
  };

  const handleToggle = async (todoId: string, completed: boolean) => {
    updateStatus(todoId, completed);
    await updateTodo(todoId, { completed });
    if (completed) {
      toast.success("Task completed!");
    }
  };

  const handleSubtaskToggle = async (
    todoId: string,
    subtaskId: string,
    checked: boolean
  ) => {
    const todo = todos.find((t: Todo) => t.id === todoId);
    if (!todo || !todo.subtasks) return;

    const updatedSubtasks = todo.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: checked } : st
    );

    const allCompleted = updatedSubtasks.every((st) => st.completed);

    if (allCompleted) {
      updateStatus(todoId, true);
      await updateTodo(todoId, { completed: true, subtasks: updatedSubtasks });
      toast.success("All subtasks done — task completed!");
    } else {
      await updateTodo(todoId, { subtasks: updatedSubtasks });
    }
  };

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <p>Error: {error}</p>
          <Button onClick={refetch}>Retry</Button>
        </div>
      </div>
    );
  }

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
              helperText={
                isLoading && todos.length === 0
                  ? "Loading..."
                  : `Found ${filteredTodos.length} of ${todos.length} todos`
              }
            />
          </div>
          <Button
            onClick={() => setIsCreateFormVisible(!isCreateFormVisible)}
            className={styles.createButton}
            disabled={isLoading}
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

            <div className={styles.formActions}>
              <Button variant="secondary" onClick={handleCancelCreate}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateTodo}
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        )}
      </div>

      <ExpandTaskForm onTaskExpanded={handleTaskExpanded} />

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Card View</h2>
        <div className={styles.cardViewContainer}>
          {isLoading && todos.length === 0 ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={styles.skeletonCard}>
                <Skeleton height={24} width="60%" />
                <Skeleton height={16} width="90%" />
                <Skeleton height={16} width="40%" />
              </div>
            ))
          ) : filteredTodos.filter((todo: Todo) => !todo.completed).length >
            0 ? (
            filteredCardTodos.map((todo: Todo) => (
              <Card
                key={todo.id}
                title={todo.title}
                description={todo.description}
                completed={todo.completed}
                subtasks={todo.subtasks}
                onToggle={(checked: boolean) => handleToggle(todo.id, checked)}
                onSubtaskToggle={(subtaskId, checked) =>
                  handleSubtaskToggle(todo.id, subtaskId, checked)
                }
              />
            ))
          ) : (
            <p className={styles.emptyMessage}>
              No todos found matching your search.
            </p>
          )}
        </div>
        {/* Card View Pagination */}
        {cardTotalPages > 1 && (
          <Pagination
            currentPage={cardCurrentPage}
            totalPages={cardTotalPages}
            onPageChange={setCardCurrentPage}
            siblingCount={1}
          />
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Table View</h2>
        {isLoading && todos.length === 0 ? (
          <div className={styles.skeletonTable}>
            <Skeleton height={40} count={5} />
          </div>
        ) : (
          <Table
            columns={columns}
            data={paginatedTodos as unknown as Record<string, unknown>[]}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No todos found. Try adjusting your search."
            toolbar={
              <StatusOption value={statusFilter} onChange={setStatusFilter} />
            }
            pagination={{
              currentPage,
              totalPages,
              onPageChange: setCurrentPage,
            }}
          />
        )}
      </div>
      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete Todo"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? `}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </>
        }
      >
        {null}
      </Dialog>
    </div>
  );
}
