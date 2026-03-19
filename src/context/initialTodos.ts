export interface TodoItem {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
}

export const initialTodos: TodoItem[] = [
  {
    id: 1,
    title: "Project setup",
    description: "Initialize the project and install dependencies",
    completed: true,
    createdAt: new Date("2026-03-10T09:00:00").getTime(),
    updatedAt: new Date("2026-03-12T14:30:00").getTime(),
  },
  {
    id: 2,
    title: "Implement component",
    description: "Create a reusable component with Radix UI",
    completed: false,
    createdAt: new Date("2026-03-12T10:00:00").getTime(),
    updatedAt: new Date("2026-03-12T10:00:00").getTime(),
  },
  {
    id: 3,
    title: "Create todo-lists page",
    description: "Build the main todo-lists page using the component",
    completed: false,
    createdAt: new Date("2026-03-14T11:00:00").getTime(),
    updatedAt: new Date("2026-03-14T11:00:00").getTime(),
  },
  {
    id: 4,
    title: "Test the application",
    description: "Verify everything works correctly",
    completed: false,
    createdAt: new Date("2026-03-16T15:00:00").getTime(),
    updatedAt: new Date("2026-03-16T15:00:00").getTime(),
  },
];
