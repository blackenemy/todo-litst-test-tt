import { customFetch } from "../../lib/customFetch";
import type { Todo, CreateTodoInput } from "./types";

export async function createTodo(
  input: CreateTodoInput
): Promise<Todo> {
  return customFetch<Todo>("/todo", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
