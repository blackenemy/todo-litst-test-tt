import type React from 'react';

export type ColumnPosition = 'left' | 'middle' | 'right';

export interface TableColumn {
  key: string;
  label: string;
  position?: ColumnPosition;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

export interface TableProps {
  columns: TableColumn[];
  data: Record<string, unknown>[];
  onView?: (rowData: Record<string, unknown>) => void;
  onEdit?: (rowData: Record<string, unknown>) => void;
  onDelete?: (rowData: Record<string, unknown>) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  toolbar?: React.ReactNode;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}
