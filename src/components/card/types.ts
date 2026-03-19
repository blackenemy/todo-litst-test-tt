export interface CardProps {
  title: string;
  description?: string;
  completed?: boolean;
  onToggle?: (completed: boolean) => void;
}