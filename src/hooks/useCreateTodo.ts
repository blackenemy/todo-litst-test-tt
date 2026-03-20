import { useState, useCallback } from "react";
import { createTodo } from "../api/todo/create-todo";
import type { Todo, CreateTodoInput } from "../api/todo/types";

export function useCreateTodo() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTodo = useCallback(async (input: CreateTodoInput): Promise<Todo | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const newTodo = await createTodo(input);
      return newTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create todo");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { addTodo, isLoading, error };
}
