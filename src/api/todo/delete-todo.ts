import { customFetch } from "../../lib/customFetch";
import type { Todo } from "./types";

export async function deleteTodo(id: string): Promise<Todo> {
  return customFetch<Todo>(`/todo/${id}`, {
    method: "DELETE",
  });
}
