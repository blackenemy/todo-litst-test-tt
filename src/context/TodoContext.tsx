import { createContext, useContext, useReducer, useCallback, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useGetTodos, useCreateTodo, useUpdateTodo, useDeleteTodo } from "../hooks";
import type { Todo, CreateTodoInput, UpdateTodoInput } from "../api/todo/types";

export interface StatusChangeData {
  id: string;
  completed: boolean;
  timestamp: number;
  previousStatus: boolean;
}

export interface TodoContextType {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  statusHistory: StatusChangeData[];
  currentStatus: Map<string, boolean>;
  updateStatus: (id: string, completed: boolean) => void;
  getStatus: (id: string) => boolean | undefined;
  getHistoryForTodo: (id: string) => StatusChangeData[];
  clearHistory: () => void;
  refetch: () => void;
  createTodo: (input: CreateTodoInput) => Promise<Todo | null>;
  updateTodo: (id: string, input: UpdateTodoInput) => Promise<Todo | null>;
  deleteTodo: (id: string) => Promise<boolean>;
}

interface TodoAction {
  type: "SET_TODOS" | "ADD_TODO" | "UPDATE_TODO" | "REMOVE_TODO" | "UPDATE_STATUS" | "CLEAR_HISTORY";
  payload?: {
    todos?: Todo[];
    todo?: Todo;
    id?: string;
    completed?: boolean;
  };
}

interface TodoState {
  todos: Todo[];
  statusHistory: StatusChangeData[];
  currentStatus: Map<string, boolean>;
}

const initialState: TodoState = {
  todos: [],
  statusHistory: [],
  currentStatus: new Map(),
};

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case "SET_TODOS":
      return {
        ...state,
        todos: action.payload?.todos || [],
      };
    case "ADD_TODO":
      return {
        ...state,
        todos: action.payload?.todo ? [action.payload.todo, ...state.todos] : state.todos,
      };
    case "UPDATE_TODO":
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload?.todo?.id ? action.payload.todo! : t
        ),
      };
    case "REMOVE_TODO":
      return {
        ...state,
        todos: state.todos.filter((t) => t.id !== action.payload?.id),
      };
    case "UPDATE_STATUS": {
      if (!action.payload?.id) return state;

      const { id, completed = false } = action.payload;
      const previousStatus = state.currentStatus.get(id) ?? false;

      if (previousStatus === completed) {
        return state;
      }

      const newCurrentStatus = new Map(state.currentStatus);
      newCurrentStatus.set(id, completed);

      const changeData: StatusChangeData = {
        id,
        completed,
        timestamp: Date.now(),
        previousStatus,
      };

      return {
        ...state,
        currentStatus: newCurrentStatus,
        statusHistory: [...state.statusHistory, changeData],
      };
    }
    case "CLEAR_HISTORY":
      return {
        ...state,
        statusHistory: [],
      };
    default:
      return state;
  }
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const { todos: apiTodos, isLoading: apiLoading, error: apiError, refetch } = useGetTodos();
  const { addTodo: apiCreateTodo, isLoading: createLoading } = useCreateTodo();
  const { editTodo: apiUpdateTodo, isLoading: updateLoading } = useUpdateTodo();
  const { removeTodo: apiDeleteTodo, isLoading: deleteLoading } = useDeleteTodo();

  useEffect(() => {
    if (apiTodos.length > 0) {
      dispatch({ type: "SET_TODOS", payload: { todos: apiTodos } });
    }
  }, [apiTodos]);

  const updateStatus = useCallback((id: string, completed: boolean) => {
    dispatch({
      type: "UPDATE_STATUS",
      payload: { id, completed },
    });
  }, []);

  const getStatus = useCallback((id: string): boolean | undefined => {
    return state.currentStatus.get(id);
  }, [state.currentStatus]);

  const getHistoryForTodo = useCallback((id: string): StatusChangeData[] => {
    return state.statusHistory.filter((change) => change.id === id);
  }, [state.statusHistory]);

  const clearHistory = useCallback(() => {
    dispatch({ type: "CLEAR_HISTORY" });
  }, []);

  const createTodo = useCallback(async (input: CreateTodoInput): Promise<Todo | null> => {
    const newTodo = await apiCreateTodo(input);
    if (newTodo) {
      dispatch({ type: "ADD_TODO", payload: { todo: newTodo } });
    }
    return newTodo;
  }, [apiCreateTodo]);

  const updateTodo = useCallback(async (id: string, input: UpdateTodoInput): Promise<Todo | null> => {
    const currentTodo = stateRef.current.todos.find((t) => t.id === id);

    // Optimistic update so UI reflects change immediately
    if (currentTodo) {
      dispatch({ type: "UPDATE_TODO", payload: { todo: { ...currentTodo, ...input } } });
    }

    const updatedTodo = await apiUpdateTodo(id, input);
    if (updatedTodo) {
      // Merge to preserve subtasks if mockAPI strips them from the response
      const finalTodo: Todo = {
        ...(currentTodo ?? {}),
        ...input,
        ...updatedTodo,
        subtasks: updatedTodo.subtasks ?? input.subtasks ?? currentTodo?.subtasks,
      };
      dispatch({ type: "UPDATE_TODO", payload: { todo: finalTodo } });
    }
    return updatedTodo;
  }, [apiUpdateTodo]);

  const deleteTodo = useCallback(async (id: string): Promise<boolean> => {
    const success = await apiDeleteTodo(id);
    if (success) {
      dispatch({ type: "REMOVE_TODO", payload: { id } });
    }
    return success;
  }, [apiDeleteTodo]);

  const value: TodoContextType = {
    todos: state.todos.length > 0 ? state.todos : apiTodos,
    isLoading: apiLoading || createLoading || updateLoading || deleteLoading,
    error: apiError,
    statusHistory: state.statusHistory,
    currentStatus: state.currentStatus,
    updateStatus,
    getStatus,
    getHistoryForTodo,
    clearHistory,
    refetch,
    createTodo,
    updateTodo,
    deleteTodo,
  };

  return (
    <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
  );
}

export function useTodoContext(): TodoContextType {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error(
      "useTodoContext must be used within a TodoProvider"
    );
  }
  return context;
}
