import customFetch from "@/utils/customFetch";

import type { Task } from "./types";

export async function getTasks(): Promise<Task[]> {
  const response = await customFetch("/task", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
}
