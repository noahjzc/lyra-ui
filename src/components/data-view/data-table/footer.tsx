import { Pagination } from '../../navigation';
import type { DataTablePagination } from './types';

export function DataTableFooter({
  currentPage,
  onPaginationChange,
  pagination,
  selectable,
  selectedSummary,
}: {
  currentPage: number;
  onPaginationChange: (nextPage: number, nextPageSize: number) => void;
  pagination?: DataTablePagination;
  selectable: boolean;
  selectedSummary: React.ReactNode;
}) {
  if (!selectable && pagination == null) return null;

  return (
    <div
      className="flex min-h-12 flex-wrap items-center justify-between gap-3 border-ui-border border-t px-3 py-2"
      data-slot="data-table-footer"
    >
      <div
        className="text-xs text-ui-muted-foreground"
        data-slot="data-table-selection-summary"
      >
        {selectable ? selectedSummary : null}
      </div>
      {pagination != null && (
        <Pagination
          compact={pagination.compact}
          current={currentPage}
          disabled={pagination.disabled}
          loading={pagination.loading}
          onChange={onPaginationChange}
          pageSize={pagination.pageSize}
          pageSizeOptions={pagination.pageSizeOptions}
          showJumper={pagination.showJumper}
          showPageSize={pagination.showPageSize}
          showQuickJump={pagination.showQuickJump}
          showTotal={pagination.showTotal}
          total={pagination.total}
          variant={pagination.variant}
        />
      )}
    </div>
  );
}
