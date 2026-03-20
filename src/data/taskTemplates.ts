export interface TaskTemplateSubtask {
  title: string;
  actions: string[];
}

export interface TaskTemplate {
  keyword: string;
  title: string;
  description: string;
  subtasks: TaskTemplateSubtask[];
}

export const taskTemplates: TaskTemplate[] = [
  {
    keyword: "user authentication",
    title: "Implement User Authentication System",
    description:
      "Set up secure user login, registration, and session management with JWT tokens and password hashing.",
    subtasks: [
      {
        title: "Backend Setup",
        actions: [
          "Create user database schema with email, password hash, and role fields",
          "Implement JWT token generation with refresh token mechanism",
          "Add password hashing using bcrypt with salt rounds",
          "Setup password reset functionality with secure tokens",
        ],
      },
      {
        title: "Frontend Integration",
        actions: [
          "Create login form component with email and password validation",
          "Implement authentication context and state management",
          "Add protected routes that require authentication",
          "Setup logout functionality with token cleanup",
        ],
      },
    ],
  },
  {
    keyword: "database setup",
    title: "Configure Database Infrastructure",
    description:
      "Set up database infrastructure including schema design, migrations, and performance optimization.",
    subtasks: [
      {
        title: "Database Configuration",
        actions: [
          "Choose appropriate database (PostgreSQL, MongoDB, or MySQL)",
          "Install and configure database client and drivers",
          "Create database and setup connection string in environment",
          "Setup connection pooling for optimal performance",
        ],
      },
      {
        title: "Schema & Migrations",
        actions: [
          "Design and document data schema with relationships",
          "Create migration files for version control",
          "Seed database with initial required data",
          "Add database indexes for frequently queried fields",
        ],
      },
    ],
  },
  {
    keyword: "api integration",
    title: "Build API Integration Layer",
    description:
      "Design and implement RESTful API endpoints with proper validation, error handling, and documentation.",
    subtasks: [
      {
        title: "API Design",
        actions: [
          "Define API endpoints and HTTP methods (GET, POST, PUT, DELETE)",
          "Document request/response formats with JSON schemas",
          "Setup centralized error handling with appropriate HTTP status codes",
          "Add input validation and sanitization middleware",
        ],
      },
      {
        title: "Implementation",
        actions: [
          "Create API client functions with proper error handling",
          "Add authentication headers and authorization tokens",
          "Implement retry logic for failed requests",
          "Setup request/response logging for debugging",
        ],
      },
    ],
  },
];

export function findTemplateByKeyword(keyword: string): TaskTemplate | null {
  const normalizedKeyword = keyword.toLowerCase().trim();
  return (
    taskTemplates.find((template) =>
      template.keyword.toLowerCase() === normalizedKeyword
    ) || null
  );
}

export function getAllKeywords(): string[] {
  return taskTemplates.map((template) => template.keyword);
}
