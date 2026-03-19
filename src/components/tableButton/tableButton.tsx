import * as React from 'react';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import type { TableButtonProps } from './types';
import { Button } from '../button';
import styles from './tableButton.module.css';

export const TableButton: React.FC<TableButtonProps> = ({
  onView,
  onEdit,
  onDelete,
  isLoading = false,
  size = 'md',
}) => {
  return (
    <div className={`${styles.buttonGroup} ${styles[`size-${size}`]}`}>
      <Button
        variant="icon"
        iconColor="view"
        onClick={onView}
        disabled={isLoading}
        title="View"
        aria-label="View item"
        size={size}
      >
        <EyeIcon className={styles.icon} />
      </Button>
      <Button
        variant="icon"
        iconColor="edit"
        onClick={onEdit}
        disabled={isLoading}
        title="Edit"
        aria-label="Edit item"
        size={size}
      >
        <PencilIcon className={styles.icon} />
      </Button>
      <Button
        variant="icon"
        iconColor="delete"
        onClick={onDelete}
        disabled={isLoading}
        title="Delete"
        aria-label="Delete item"
        size={size}
      >
        <TrashIcon className={styles.icon} />
      </Button>
    </div>
  );
};
