import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StatusProvider } from "./context";
import TodoListsPage from "./pages/todo-lists/todo-lists";
import TodoDetailPage from "./pages/todo-details/todo-detail";
import "./App.css";

function App() {
  return (
    <StatusProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/todos" element={<TodoListsPage />} />
          <Route path="/" element={<TodoListsPage />} />
          <Route path="/todo/:id" element={<TodoDetailPage />} />
        </Routes>
      </BrowserRouter>
    </StatusProvider>
  );
}

export default App;
