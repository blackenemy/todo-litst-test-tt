import { useState, useCallback } from "react";
import { updateTodo } from "../api/todo/update-todo";
import type { Todo, UpdateTodoInput } from "../api/todo/types";

export function useUpdateTodo() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editTodo = useCallback(
    async (id: string, input: UpdateTodoInput): Promise<Todo | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedTodo = await updateTodo(id, input);
        return updatedTodo;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update todo");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { editTodo, isLoading, error };
}
