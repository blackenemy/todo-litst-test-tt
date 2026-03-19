import { customFetch } from "../../lib/customFetch";
import type { Todo, UpdateTodoInput } from "./types";

export async function updateTodo(
  id: string,
  input: UpdateTodoInput
): Promise<Todo> {
  return customFetch<Todo>(`/todo/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
