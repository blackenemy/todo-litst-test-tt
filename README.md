# Installation

1. **Clone repository**
   ```sh
   git clone <repo-url>
   cd todo-litst-test-tt
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Start development server**
   ```sh
   npm run dev
   ```
   - จะติดตั้งและรัน Ollama (AI backend) อัตโนมัติถ้ายังไม่มีในเครื่อง (macOS และ Windows)
   - macOS: ติดตั้งอัตโนมัติผ่าน Homebrew หากยังไม่มี Ollama
   - Windows: แนะนำให้ติดตั้ง Ollama ด้วย winget หรือดาวน์โหลดจาก https://ollama.com/download หากยังไม่มี (รองรับการรันผ่าน Git Bash หรือ WSL)
   - เปิดเว็บแอปที่ http://localhost:5173

---

# Project Architecture — Todo List App

## Stack

| Layer         | Technology                       |
| ------------- | -------------------------------- |
| Framework     | React 19 + TypeScript 5 (strict) |
| Routing       | React Router DOM v7              |
| Build         | Vite 8                           |
| UI Primitives | Radix UI                         |
| Icons         | Heroicons                        |
| Toast         | Sonner                           |
| Skeleton      | React Loading Skeleton           |
| API           | MockAPI (customFetch wrapper)    |

---

## Folder Structure

```
src/
├── api/                  # API client functions (per resource)
│   ├── todo/
│   │   ├── types.ts      # Todo, CreateTodoInput, UpdateTodoInput, Subtask
│   │   ├── get-todos.ts
│   │   ├── get-todo.ts
│   │   ├── create-todo.ts
│   │   ├── update-todo.ts
│   │   ├── delete-todo.ts
│   │   └── index.ts
│   └── task/
│       ├── types.ts
│       ├── get-task.ts
│       ├── get-tasks.ts
│       └── index.ts
│
├── components/           # Reusable UI components (feature-agnostic)
│   ├── badge/
│   ├── button/
│   ├── card/
│   ├── checkbox/
│   ├── dialog/
│   ├── input/
│   ├── option/
│   ├── pagination/
│   ├── table/
│   ├── tableButton/
│   ├── textarea/
│   └── expand-task-form/
│
├── context/              # Global state (useReducer pattern)
│   ├── TodoContext.tsx
│   ├── StatusContext.tsx
│   ├── initialTodos.ts
│   └── index.ts
│
├── hooks/                # Data-fetching hooks (wrap API + state)
│   ├── useGetTodos.ts
│   ├── useCreateTodo.ts
│   ├── useUpdateTodo.ts
│   └── useDeleteTodo.ts
│
├── pages/                # Route-level components
│   ├── todo-lists/
│   │   └── todo-lists.tsx
│   └── todo-details/
│       └── todo-detail.tsx
│
├── lib/
│   └── customFetch.ts    # Base fetch wrapper
├── utils/                # Pure helper functions
├── layouts/              # Layout wrappers
├── data/                 # Static/seed data
└── assets/
```

---

## Layer Responsibilities

### 1. `lib/customFetch.ts` — Transport Layer

```
BASE_URL → https://69bc323d0915748735bb828e.mockapi.io/api/v1

customFetch<T>(endpoint, options?) → Promise<T>
  - Appends query params via URLSearchParams
  - Sets Content-Type: application/json automatically
  - Parses error response body for meaningful messages
```

ทุก API function ใช้ `customFetch` เป็น base เดียวกัน ไม่มี axios หรือ library อื่น

---

### 2. `api/` — API Client Functions

แต่ละ resource มี folder แยก โครงสร้างภายใน:

```
api/todo/
  ├── types.ts          ← type definitions เฉพาะของ resource นี้
  ├── get-todos.ts      ← GET /todo
  ├── get-todo.ts       ← GET /todo/:id
  ├── create-todo.ts    ← POST /todo
  ├── update-todo.ts    ← PUT /todo/:id
  ├── delete-todo.ts    ← DELETE /todo/:id
  └── index.ts          ← barrel export
```

**Pattern:** function เล็ก ทำงานเดียว return typed Promise

```ts
// ตัวอย่าง create-todo.ts
export const createTodo = (input: CreateTodoInput): Promise<Todo> =>
  customFetch("/todo", { method: "POST", body: JSON.stringify(input) });
```

---

### 3. `hooks/` — Data Fetching Hooks

Hooks ห่อ API functions เพิ่ม loading/error state:

```
useGetTodos    → { todos, isLoading, error, refetch }
useCreateTodo  → { addTodo(input), isLoading, error }
useUpdateTodo  → { editTodo(id, input), isLoading, error }
useDeleteTodo  → { removeTodo(id), isLoading, error }
```

**Pattern:** `useState` + `useCallback` + async/await

```ts
// ทุก mutation hook ใช้ pattern เดียวกัน
const addTodo = useCallback(async (input) => {
  setIsLoading(true);
  try {
    const result = await createTodo(input);
    return result;
  } catch (e) {
    setError(e);
    return null;
  } finally {
    setIsLoading(false);
  }
}, []);
```

Hooks ไม่แตะ global state — มีหน้าที่แค่คุย API เท่านั้น

---

### 4. `context/` — Global State

ใช้ **useReducer** pattern แยกเป็น 2 context:

#### TodoContext

```
State: { todos: Todo[], statusHistory: StatusChangeData[] }

Actions:
  SET_TODOS    → โหลด todos จาก API
  ADD_TODO     → เพิ่ม todo ใหม่
  UPDATE_TODO  → แก้ไข todo (รองรับ optimistic update)
  REMOVE_TODO  → ลบ todo
  UPDATE_STATUS → บันทึก status change
  CLEAR_HISTORY → ล้าง history

Methods (expose ผ่าน context):
  createTodo(input)   → เรียก hook + dispatch ADD_TODO
  updateTodo(id, input) → dispatch optimistic → API → dispatch sync
  deleteTodo(id)      → API → dispatch REMOVE_TODO
  refetch()           → โหลดใหม่จาก API
```

#### StatusContext

```
Methods:
  updateStatus(id, status)   → บันทึก change พร้อม timestamp
  getStatus(id)              → ดู status ปัจจุบัน
  getHistoryForTodo(id)      → ดู history ของ todo นั้น
  clearHistory()             → ล้าง history ทั้งหมด
```

**Provider nesting ใน App.tsx:**

```
<StatusProvider>
  <TodoProvider>
    <App />
  </TodoProvider>
</StatusProvider>
```

---

### 5. `components/` — Reusable UI

แต่ละ component มีโครงสร้าง 6 ไฟล์:

```
component/
  ├── component.tsx       ← logic + JSX
  ├── component.module.css ← scoped styles
  ├── types.ts            ← props interface
  ├── constants.ts        ← enum/const ของ component นี้
  ├── helpers.ts          ← pure functions (optional)
  └── index.ts            ← barrel export
```

Components ไม่รู้จัก context หรือ API — รับแค่ props เท่านั้น (pure presentational)

**ตัวอย่าง Button variants:** `primary | secondary | danger | icon`
**ตัวอย่าง Table:** รับ columns config + render function + pagination + callbacks

---

### 6. `pages/` — Route Components

Pages เป็น smart component ที่:

- ดึงข้อมูลจาก context
- จัดการ local UI state (search, filter, dialog open/close)
- ส่ง callbacks ลง components

#### TodoListsPage (`/todos`)

```
State: searchQuery, statusFilter, currentPage, cardCurrentPage,
       isCreateFormVisible, deleteTarget

Features:
  - Search + filter (combine เป็น filteredTodos)
  - Card view (pending todos) + Table view (all todos)
  - Pagination แยกกัน 2 view
  - Create dialog (ExpandTaskForm)
  - Delete confirm dialog
  - Skeleton loading
  - Toast on success/error
```

#### TodoDetailPage (`/todo/:id`)

```
Modes: view | edit

View: แสดงข้อมูล + timestamp + status badge
Edit: form inputs → handleSave() → updateTodo() → toast

Data: ดึงจาก route state หรือ find ใน context ตาม id
```

---

## Data Flow

### Create

```
Page → createTodo(input) → hook: addTodo() → API POST
                         ↓
                   dispatch ADD_TODO → state update → re-render
                         ↓
                   toast success / reset form
```

### Update (Optimistic)

```
Page → updateTodo(id, input)
         ↓
   dispatch UPDATE_TODO (optimistic — UI update ทันที)
         ↓
   API PUT /todo/:id
         ↓
   dispatch UPDATE_TODO (sync กับ API response)
         ↓
   toast success
```

### Delete

```
Page → open confirm dialog → handleConfirmDelete()
         ↓
   API DELETE /todo/:id
         ↓
   dispatch REMOVE_TODO → state update
         ↓
   toast success
```

### Status Toggle (Card/Table)

```
User clicks checkbox → handleToggle()
         ↓
   updateStatus() (StatusContext) — บันทึก history
         ↓
   updateTodo() — sync กับ API
         ↓
   ถ้า subtasks ทุกอันเสร็จ → auto-complete parent
```

---

## Key Patterns สรุป

| Pattern              | ใช้ที่ไหน       | ประโยชน์                          |
| -------------------- | --------------- | --------------------------------- |
| Barrel Exports       | ทุก folder      | import สั้น ไม่ต้องรู้ path ภายใน |
| CSS Modules          | ทุก component   | scoped styles ไม่ clash           |
| useReducer + Context | context/        | predictable state, testable       |
| Optimistic Update    | updateTodo      | UX ดี ไม่รอ API                   |
| Custom Hooks         | hooks/          | แยก concern, reusable             |
| TypeScript strict    | ทั้ง project    | type safety ตั้งแต่ API ถึง UI    |
| Mock API             | lib/customFetch | dev โดยไม่ต้องมี backend          |

---

## ข้อดีของ Architecture นี้

1. **Separation of Concerns ชัดเจน** — API / Hook / Context / Component / Page แต่ละชั้นทำงานของตัวเอง ไม่ก้าวก่ายกัน
2. **Type-safe ตลอด chain** — type เดียวกันไหลจาก API response → context → props → UI
3. **Predictable State** — useReducer ทำให้ trace state change ง่าย
4. **Optimistic UI** — user ไม่รอ API latency ในการ update
5. **Reusable Components** — components ไม่ผูกกับ business logic ย้ายไปใช้ที่อื่นได้ทันที
6. **Scalable** — เพิ่ม resource ใหม่ (เช่น tag, project) โดยทำตาม pattern เดิมใน api/, hooks/, context/ ได้เลย
