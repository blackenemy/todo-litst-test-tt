export interface Task {
  id: string;
  title: string;
  createdAt: string;
  actions: unknown[];
}

export interface CreateTaskInput {
  title: string;
}

export interface UpdateTaskInput {
  title?: string;
}
