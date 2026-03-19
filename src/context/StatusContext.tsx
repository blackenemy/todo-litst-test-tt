import { createContext, useContext, useReducer } from "react";
import type { ReactNode } from "react";

export interface StatusChangeData {
  id: string;
  completed: boolean;
  timestamp: number;
  previousStatus: boolean;
}

export interface StatusContextType {
  statusHistory: StatusChangeData[];
  currentStatus: Map<string, boolean>;
  updateStatus: (id: string, completed: boolean) => void;
  getStatus: (id: string) => boolean | undefined;
  getHistoryForTodo: (id: string) => StatusChangeData[];
  clearHistory: () => void;
}

interface StatusAction {
  type: "UPDATE_STATUS" | "CLEAR_HISTORY";
  payload?: {
    id?: string;
    completed?: boolean;
  };
}

interface StatusState {
  statusHistory: StatusChangeData[];
  currentStatus: Map<string, boolean>;
}

const initialState: StatusState = {
  statusHistory: [],
  currentStatus: new Map(),
};

const statusReducer = (state: StatusState, action: StatusAction): StatusState => {
  switch (action.type) {
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
        statusHistory: [],
        currentStatus: state.currentStatus,
      };
    default:
      return state;
  }
};

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export function StatusProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(statusReducer, initialState);

  const updateStatus = (id: string, completed: boolean) => {
    dispatch({
      type: "UPDATE_STATUS",
      payload: { id, completed },
    });
  };

  const getStatus = (id: string): boolean | undefined => {
    return state.currentStatus.get(id);
  };

  const getHistoryForTodo = (id: string): StatusChangeData[] => {
    return state.statusHistory.filter((change) => change.id === id);
  };

  const clearHistory = () => {
    dispatch({ type: "CLEAR_HISTORY" });
  };

  const value: StatusContextType = {
    statusHistory: state.statusHistory,
    currentStatus: state.currentStatus,
    updateStatus,
    getStatus,
    getHistoryForTodo,
    clearHistory,
  };

  return (
    <StatusContext.Provider value={value}>{children}</StatusContext.Provider>
  );
}

export function useStatusContext(): StatusContextType {
  const context = useContext(StatusContext);
  if (!context) {
    throw new Error(
      "useStatusContext must be used within a StatusProvider"
    );
  }
  return context;
}
