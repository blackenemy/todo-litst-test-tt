import { customFetch } from "../../lib/customFetch";
import type { Todo } from "./types";

export async function getTodo(id: string): Promise<Todo> {
  return customFetch<Todo>(`/todo/${id}`);
}
