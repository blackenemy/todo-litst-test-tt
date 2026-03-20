import type { Subtask } from "@/context/initialTodos";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  subtasks?: Subtask[];
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  completed?: boolean;
  subtasks?: Subtask[];
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
  subtasks?: Subtask[];
}
