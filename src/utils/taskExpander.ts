import type { TodoItem, Subtask } from "../context/initialTodos";
import {
  type TaskTemplate,
  findTemplateByKeyword,
} from "../data/taskTemplates";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function expandKeywordToTask(keyword: string): TodoItem | null {
  const template = findTemplateByKeyword(keyword);

  if (!template) {
    return null;
  }

  return expandTemplateToTodo(template);
}

export function expandTemplateToTodo(template: TaskTemplate): TodoItem {
  const now = Date.now();

  const subtasks: Subtask[] = template.subtasks.map((subtaskTemplate) => ({
    id: generateId(),
    title: subtaskTemplate.title,
    completed: false,
    actions: subtaskTemplate.actions.map((actionTitle) => ({
      id: generateId(),
      title: actionTitle,
      completed: false,
    })),
  }));

  return {
    id: 0,
    title: template.title,
    description: template.description,
    completed: false,
    subtasks,
    createdAt: now,
    updatedAt: now,
  };
}

export function getTaskPreview(
  keyword: string
): { success: true; todo: TodoItem; keyword: string } | { success: false; keyword: string } {
  const todo = expandKeywordToTask(keyword);

  if (todo) {
    return { success: true, todo, keyword };
  } else {
    return { success: false, keyword };
  }
}
