import { customFetch } from "@/lib/customFetch";

import type { Task } from "./types";

export async function getTask(id: string): Promise<Task | null> {
  try {
    return await customFetch<Task>(`/task/${id}`, { method: "GET" });
  } catch (err) {
    if (err instanceof Error && err.message.includes("HTTP error 404")) return null;
    throw err;
  }
}
