export interface TableButtonProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
