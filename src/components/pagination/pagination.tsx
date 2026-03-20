import type { PaginationProps } from "./types";
import styles from "./pagination.module.css";

function getPageRange(
  current: number,
  total: number,
  siblings: number
): (number | "…")[] {
  const totalVisible = siblings * 2 + 5; // siblings on each side + current + 2 boundaries + 2 ellipsis

  if (total <= totalVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(current - siblings, 1);
  const rightSibling = Math.min(current + siblings, total);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < total - 1;

  const pages: (number | "…")[] = [];

  pages.push(1);

  if (showLeftEllipsis) {
    pages.push("…");
  } else if (leftSibling === 2) {
    pages.push(2);
  }

  for (
    let i = leftSibling > 2 ? leftSibling : Math.max(2, leftSibling);
    i <= Math.min(rightSibling, total - 1);
    i++
  ) {
    if (!pages.includes(i)) pages.push(i);
  }

  if (showRightEllipsis) {
    pages.push("…");
  } else if (rightSibling === total - 1) {
    if (!pages.includes(total - 1)) pages.push(total - 1);
  }

  pages.push(total);

  return pages;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  const pages = getPageRange(currentPage, totalPages, siblingCount);

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        className={`${styles.pageButton} ${
          currentPage === 1 ? styles.disabled : ""
        }`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        «
      </button>

      {pages.map((page, index) =>
        page === "…" ? (
          <span key={`ellipsis-${index}`} className={styles.ellipsis}>
            …
          </span>
        ) : (
          <button
            key={page}
            className={`${styles.pageButton} ${
              page === currentPage ? styles.active : ""
            }`}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        className={`${styles.pageButton} ${
          currentPage === totalPages ? styles.disabled : ""
        }`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        »
      </button>
    </nav>
  );
}

export default Pagination;
