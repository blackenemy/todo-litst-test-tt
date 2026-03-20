import { customFetch } from "@/lib/customFetch";

import type { Task } from "./types";

export async function getTasks(): Promise<Task[]> {
  return customFetch<Task[]>("/task", { method: "GET" });
}
