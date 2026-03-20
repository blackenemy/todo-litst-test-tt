import { useState, useCallback } from "react";
import { deleteTodo } from "../api/todo/delete-todo";

export function useDeleteTodo() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeTodo = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteTodo(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete todo");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { removeTodo, isLoading, error };
}
