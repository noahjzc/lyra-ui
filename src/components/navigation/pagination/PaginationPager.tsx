import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { PaginationEllipsis } from './PaginationEllipsis';
import { PaginationPageButton } from './PaginationPageButton';
import type { PaginationPageItem } from './types';

export interface PaginationPagerProps {
  compact?: boolean;
  currentPage: number;
  disabled?: boolean;
  onPageChange: (page: number) => void;
  pageCount: number;
  pageItems: PaginationPageItem[];
  showQuickJump?: boolean;
  simple?: boolean;
}

export function PaginationPager({
  compact = false,
  currentPage,
  disabled = false,
  onPageChange,
  pageCount,
  pageItems,
  showQuickJump = false,
  simple = false,
}: PaginationPagerProps) {
  const hasPreviousQuickJump = showQuickJump && currentPage > 6;
  const hasNextQuickJump = showQuickJump && currentPage < pageCount - 5;
  const previousQuickJumpPage = Math.max(currentPage - 5, 1);
  const nextQuickJumpPage = Math.min(currentPage + 5, pageCount);
  const itemSize = compact || simple ? 'small' : 'middle';

  return (
    <div
      className="flex min-w-0 items-center gap-1.5"
      data-slot="pagination-pager"
    >
      {compact && (
        <span
          className="mr-1 text-ui-muted-foreground"
          data-slot="pagination-compact-summary"
        >
          第 {currentPage} / {pageCount} 页
        </span>
      )}
      <PaginationPageButton
        aria-label="上一页"
        disabled={disabled || currentPage <= 1}
        iconOnly
        onClick={() => onPageChange(currentPage - 1)}
        size={itemSize}
      >
        <ChevronLeft aria-hidden="true" className="size-4" />
      </PaginationPageButton>
      {simple ? (
        <span
          aria-current="page"
          className="min-w-14 text-center text-ui-foreground"
          data-slot="pagination-simple-current"
        >
          {currentPage} / {pageCount}
        </span>
      ) : compact ? (
        <PaginationPageButton
          active
          aria-current="page"
          aria-label={`第 ${currentPage} 页`}
          disabled={disabled}
          onClick={() => onPageChange(currentPage)}
          size={itemSize}
        >
          {currentPage}
        </PaginationPageButton>
      ) : (
        <>
          {hasPreviousQuickJump && (
            <PaginationPageButton
              aria-label="向前 5 页"
              disabled={disabled}
              iconOnly
              onClick={() => onPageChange(previousQuickJumpPage)}
              size={itemSize}
            >
              <ChevronsLeft aria-hidden="true" className="size-4" />
            </PaginationPageButton>
          )}
          {pageItems.map(item =>
            typeof item === 'number' ? (
              <PaginationPageButton
                active={item === currentPage}
                aria-current={item === currentPage ? 'page' : undefined}
                aria-label={`第 ${item} 页`}
                disabled={disabled}
                key={item}
                onClick={() => onPageChange(item)}
                size={itemSize}
              >
                {item}
              </PaginationPageButton>
            ) : (
              <PaginationEllipsis key={item} />
            ),
          )}
          {hasNextQuickJump && (
            <PaginationPageButton
              aria-label="向后 5 页"
              disabled={disabled}
              iconOnly
              onClick={() => onPageChange(nextQuickJumpPage)}
              size={itemSize}
            >
              <ChevronsRight aria-hidden="true" className="size-4" />
            </PaginationPageButton>
          )}
        </>
      )}
      <PaginationPageButton
        aria-label="下一页"
        disabled={disabled || currentPage >= pageCount}
        iconOnly
        onClick={() => onPageChange(currentPage + 1)}
        size={itemSize}
      >
        <ChevronRight aria-hidden="true" className="size-4" />
      </PaginationPageButton>
    </div>
  );
}
