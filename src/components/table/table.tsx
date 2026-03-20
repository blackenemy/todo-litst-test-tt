import type { ReactNode } from 'react';
import type { TableProps, ColumnPosition } from './types';
import { TableButton } from '../tableButton';
import { Pagination } from '../pagination';
import styles from './table.module.css';

function Table({
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  isLoading = false,
  emptyMessage = 'No data available',
  toolbar,
  pagination,
}: TableProps) {
  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  const handleView = (rowData: Record<string, unknown>) => {
    onView?.(rowData);
  };

  const handleEdit = (rowData: Record<string, unknown>) => {
    onEdit?.(rowData);
  };

  const handleDelete = (rowData: Record<string, unknown>) => {
    onDelete?.(rowData);
  };

  const organizeColumnsByPosition = (cols: typeof columns): typeof columns => {
    const left: typeof columns = [];
    const middle: typeof columns = [];
    const right: typeof columns = [];

    cols.forEach((col: typeof columns[number]) => {
      const position: ColumnPosition = col.position || 'middle';
      switch (position) {
        case 'left':
          left.push(col);
          break;
        case 'right':
          right.push(col);
          break;
        case 'middle':
        default:
          middle.push(col);
          break;
      }
    });

    return [...left, ...middle, ...right];
  };

  const orderedColumns = organizeColumnsByPosition(columns);

  return (
    <div className={styles.tableWrapper}>
      {toolbar && <div className={styles.toolbar}>{toolbar}</div>}
      <table className={styles.table}>
        <thead>
          <tr>
            {orderedColumns.map((column: { key: string; label: string; position?: ColumnPosition }) => {
              const positionClass = column.position ? styles[column.position] : styles.middle;
              return (
                <th key={column.key} className={`${styles.th} ${positionClass}`}>
                  {column.label}
                </th>
              );
            })}
            <th className={`${styles.th} ${styles.middle}`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: Record<string, unknown>, index: number) => (
            <tr key={index} className={styles.tr}>
              {orderedColumns.map((column: { key: string; label: string; position?: ColumnPosition; render?: (value: unknown, row: Record<string, unknown>) => ReactNode }) => {
                const positionClass = column.position ? styles[column.position] : styles.middle;
                return (
                  <td key={column.key} className={`${styles.td} ${positionClass}`}>
                    {column.render
                      ? column.render(row[column.key], row)
                      : (row[column.key] as ReactNode)}
                  </td>
                );
              })}
              <td className={`${styles.tdActions} ${styles.middle}`}>
                <TableButton
                  onView={() => handleView(row)}
                  onEdit={() => handleEdit(row)}
                  onDelete={() => handleDelete(row)}
                  isLoading={isLoading}
                  size="sm"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
}

export default Table;
