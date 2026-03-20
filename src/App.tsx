import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { TodoProvider, StatusProvider } from "./context";
import TodoListsPage from "./pages/todo-lists/todo-lists";
import TodoDetailPage from "./pages/todo-details/todo-detail";
import "./App.css";

function App() {
  return (
    <StatusProvider>
      <TodoProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/todos" element={<TodoListsPage />} />
          <Route path="/" element={<TodoListsPage />} />
          <Route path="/todo/:id" element={<TodoDetailPage />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
      </TodoProvider>
    </StatusProvider>
  );
}

export default App;
