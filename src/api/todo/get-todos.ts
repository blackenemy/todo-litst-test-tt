import { customFetch } from "../../lib/customFetch";
import type { Todo } from "./types";

export async function getTodos(): Promise<Todo[]> {
  return customFetch<Todo[]>("/todo");
}
