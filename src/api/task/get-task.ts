import customFetch from "@/utils/customFetch";

import type { Task } from "./types";

export async function getTask(id: string): Promise<Task | null> {
  const response = await customFetch(`/task/${id}`, {
    method: "GET",
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error("Failed to fetch task");
  }

  return response.json();
}
