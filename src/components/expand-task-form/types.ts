import type { TodoItem } from "../../context/initialTodos";

export interface ExpandTaskFormProps {
  onTaskExpanded: (todo: TodoItem) => void;
}
