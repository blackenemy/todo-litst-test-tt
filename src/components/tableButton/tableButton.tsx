import * as React from 'react';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import type { TableButtonProps } from './types';
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
      <button
        className={`${styles.button} ${styles.viewButton}`}
        onClick={onView}
        disabled={isLoading}
        title="View"
        aria-label="View item"
      >
        <EyeIcon className={styles.icon} />
      </button>
      <button
        className={`${styles.button} ${styles.editButton}`}
        onClick={onEdit}
        disabled={isLoading}
        title="Edit"
        aria-label="Edit item"
      >
        <PencilIcon className={styles.icon} />
      </button>
      <button
        className={`${styles.button} ${styles.deleteButton}`}
        onClick={onDelete}
        disabled={isLoading}
        title="Delete"
        aria-label="Delete item"
      >
        <TrashIcon className={styles.icon} />
      </button>
    </div>
  );
};
