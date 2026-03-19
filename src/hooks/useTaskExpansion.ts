import { useState, useCallback } from "react";
import type { TodoItem, Subtask } from "@/context/initialTodos";
import { getTasks } from "@/api/task";

interface OllamaResponse {
  description: string;
  subtasks: Array<{
    title: string;
    actions: string[];
  }>;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

async function callOllama(keyword: string): Promise<OllamaResponse> {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3.2:latest",
      prompt: `You are a smart task assistant. The user has entered a keyword or short phrase: "${keyword}"

Your job is to intelligently interpret this and create an actionable task plan.

First, interpret the user's intent:
- If it's a verb ("build", "create", "fix", "plan" / "สร้าง", "แก้ไข", "วางแผน"): suggest a task with practical steps
- If it's a noun ("meeting", "report", "project" / "ประชุม", "รายงาน", "โปรเจกต์"): create a meaningful subtask structure
- If it's an abstract concept ("success", "growth" / "ความสำเร็จ", "การเติบโต"): translate into concrete actions
- If it's vague ("stuff", "things" / "ของ", "สิ่งต่างๆ"): create a generic but useful task

IMPORTANT: Respond in the SAME language as the input keyword.
- If keyword is in Thai (contains Thai characters), respond entirely in Thai
- If keyword is in English, respond in English

Generate a JSON object with this structure:
{
  "description": "A clear, 1-2 sentence description of what the task entails, based on your interpretation of "${keyword}"",
  "subtasks": [
    {
      "title": "Phase or category name",
      "actions": [
        "Specific, actionable step (imperative verb form)",
        "Next actionable step",
        "Another concrete action"
      ]
    }
  ]
}

Rules:
- Respond in the SAME language as the input keyword
- Actions should be 3-6 words, starting with action verbs
- Create 2-4 subtask phases
- Each subtask should have 2-4 actionable items
- Be practical and specific, not generic
- Use the keyword "${keyword}" to create meaningful, contextual tasks

Return ONLY the JSON object, no markdown, no explanation.`,
      stream: false,
      options: {
        temperature: 0.7,
        num_predict: 800,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to call Ollama");
  }

  const data = await response.json();
  let rawResponse = (data.response as string).trim();

  rawResponse = rawResponse
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const jsonStart = rawResponse.indexOf("{");
  const jsonEnd = rawResponse.lastIndexOf("}");
  
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("No valid JSON found in Ollama response");
  }

  const jsonString = rawResponse.slice(jsonStart, jsonEnd + 1);

  try {
    return JSON.parse(jsonString) as OllamaResponse;
  } catch {
    throw new Error(`Failed to parse Ollama response as JSON: ${jsonString.slice(0, 100)}...`);
  }
}

export interface UseTaskExpansionReturn {
  expandTask: (keyword: string) => Promise<TodoItem | null>;
  isLoading: boolean;
  error: string | null;
}

export function useTaskExpansion(): UseTaskExpansionReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expandTask = useCallback(async (keyword: string): Promise<TodoItem | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const tasks = await getTasks();
      const task = tasks.find(t => t.title.toLowerCase() === keyword.toLowerCase());

      const contextHint = task ? `This relates to an existing task: "${task.title}"` : "Create a new task from scratch.";
      const enhancedKeyword = `${contextHint}. User keyword/phrase: "${keyword}"`;

      const ollamaResponse = await callOllama(enhancedKeyword);

      const subtasks: Subtask[] = ollamaResponse.subtasks.map((subtask) => ({
        id: generateId(),
        title: subtask.title,
        completed: false,
        actions: subtask.actions.map((actionTitle) => ({
          id: generateId(),
          title: actionTitle,
          completed: false,
        })),
      }));

      const now = Date.now();
      const todoItem: TodoItem = {
        id: 0,
        title: task ? task.title : keyword,
        description: ollamaResponse.description,
        completed: false,
        subtasks,
        createdAt: now,
        updatedAt: now,
      };

      return todoItem;
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    expandTask,
    isLoading,
    error,
  };
}
