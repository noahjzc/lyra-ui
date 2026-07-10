import { PaginationJumper } from './PaginationJumper';
import { PaginationPager } from './PaginationPager';
import { PaginationPageSize } from './PaginationPageSize';
import { getPageItems } from './page-items';
import type { PaginationProps } from './types';

export type { PaginationProps } from './types';

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

export function Pagination({
  compact = false,
  current,
  disabled = false,
  loading = false,
  page,
  pageSize,
  total,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  showJumper = false,
  showPageSize,
  showQuickJump = false,
  showTotal,
  variant = compact ? 'compact' : 'table',
  onChange,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(current ?? page ?? 1, 1), pageCount);
  const isCompact = variant === 'compact';
  const isSimple = variant === 'simple';
  const interactionDisabled = disabled || loading;
  const shouldShowTotal = showTotal ?? (!isCompact && !isSimple);
  const shouldShowPageSize = showPageSize ?? (!isCompact && !isSimple);
  const pageItems =
    isCompact || isSimple ? [] : getPageItems(currentPage, pageCount);

  function handlePageChange(nextPage: number) {
    if (interactionDisabled) return;

    onPageChange?.(nextPage);
    onChange?.(nextPage, pageSize);
  }

  function handlePageSizeChange(nextPageSize: number) {
    if (interactionDisabled) return;

    onPageSizeChange?.(nextPageSize);
    onChange?.(1, nextPageSize);
  }

  function handleJump(nextPage: number) {
    handlePageChange(nextPage);
  }

  return (
    <nav
      aria-busy={loading ? true : undefined}
      aria-label="分页"
      className="flex flex-wrap items-center justify-end gap-4 text-sm text-ui-muted-foreground"
      data-slot="pagination"
    >
      {shouldShowTotal && (
        <div className="whitespace-nowrap" data-slot="pagination-total">
          共 {total} 条
        </div>
      )}
      <PaginationPager
        compact={isCompact}
        currentPage={currentPage}
        disabled={interactionDisabled}
        onPageChange={handlePageChange}
        pageCount={pageCount}
        pageItems={pageItems}
        showQuickJump={showQuickJump}
        simple={isSimple}
      />
      {shouldShowPageSize && (
        <PaginationPageSize
          disabled={interactionDisabled || (!onPageSizeChange && !onChange)}
          onChange={handlePageSizeChange}
          options={pageSizeOptions}
          pageSize={pageSize}
        />
      )}
      {showJumper && !isCompact && !isSimple && (
        <PaginationJumper
          currentPage={currentPage}
          disabled={interactionDisabled}
          onJump={handleJump}
          pageCount={pageCount}
        />
      )}
    </nav>
  );
}
