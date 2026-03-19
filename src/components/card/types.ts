import type { Subtask } from "../../context/initialTodos";

export interface CardProps {
  title: string;
  description?: string;
  completed?: boolean;
  subtasks?: Subtask[];
  onToggle?: (completed: boolean) => void;
  onSubtaskToggle?: (subtaskId: string, completed: boolean) => void;
  onActionToggle?: (subtaskId: string, actionId: string, completed: boolean) => void;
}