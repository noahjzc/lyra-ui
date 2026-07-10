import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowData,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import { DataTableBody } from './body';
import { DataTableFooter } from './footer';
import { DataTableHeader } from './header';
import { SelectionCell, SelectionHeader } from './selection-column';
import {
  DataTableFilterBar,
  DataTableSelectionBar,
  DataTableToolbar,
} from './toolbar';
import type { DataTableColumn, DataTableProps } from './types';
import {
  deriveColumnPinning,
  getDensity,
  normalizeSelectableColumnPinning,
  resolveUpdater,
} from './utils';

export type {
  DataTableColumn,
  DataTableColumnMeta,
  DataTableDensity,
  DataTablePagination,
  DataTableProps,
} from './types';

export function DataTable<TData extends RowData>({
  actions,
  className,
  columnOrder,
  columnPinning,
  columnSizing,
  columnVisibility,
  columns,
  compact = false,
  data,
  defaultColumnPinning,
  defaultColumnVisibility,
  defaultRowSelection,
  defaultSorting,
  density,
  description,
  empty,
  emptyAction,
  emptyDescription,
  emptyText = '暂无数据',
  error,
  filterBarLabel,
  filters,
  getRowId,
  loading = false,
  onColumnPinningChange,
  onColumnVisibilityChange,
  onRetry,
  onRowClick,
  onRowSelectionChange,
  onSortingChange,
  pagination,
  renderExpandedRow,
  rowSelection,
  selectable = false,
  selectedSummary,
  selectionActions,
  sorting,
  stickyHeader = true,
  title,
  toolbar,
  variant = 'standard',
  ...props
}: DataTableProps<TData>) {
  const resolvedDensity = getDensity(density, compact);
  const [internalSorting, setInternalSorting] = React.useState<SortingState>(
    defaultSorting ?? [],
  );
  const [internalRowSelection, setInternalRowSelection] =
    React.useState<RowSelectionState>(defaultRowSelection ?? {});
  const [internalColumnVisibility, setInternalColumnVisibility] =
    React.useState<VisibilityState>(defaultColumnVisibility ?? {});
  const [internalColumnPinning, setInternalColumnPinning] = React.useState(
    () => defaultColumnPinning ?? deriveColumnPinning({ columns, selectable }),
  );
  const [internalCurrent, setInternalCurrent] = React.useState(
    pagination?.current ?? 1,
  );
  const effectiveSorting = sorting ?? internalSorting;
  const effectiveRowSelection = rowSelection ?? internalRowSelection;
  const effectiveColumnVisibility =
    columnVisibility ?? internalColumnVisibility;
  const effectiveColumnPinning =
    columnPinning ??
    normalizeSelectableColumnPinning(
      internalColumnPinning,
      selectable && defaultColumnPinning == null,
    );
  const pageSize = pagination?.pageSize ?? Math.max(data.length, 1);
  const currentPage = pagination?.current ?? internalCurrent;
  const tablePagination = {
    pageIndex: Math.max(currentPage - 1, 0),
    pageSize,
  };

  const tableColumns = React.useMemo<DataTableColumn<TData>[]>(() => {
    if (!selectable) return columns;

    const selectionColumn: DataTableColumn<TData> = {
      id: '__select__',
      cell: ({ row }) => <SelectionCell row={row} />,
      enableHiding: false,
      enableSorting: false,
      header: ({ table }) => <SelectionHeader table={table} />,
      meta: {
        align: 'center',
        pinned: 'left',
        width: 44,
      },
      size: 44,
    };

    return [selectionColumn, ...columns];
  }, [columns, selectable]);

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table 的实例方法由库 API 设计决定。
  const table = useReactTable({
    columnResizeMode: 'onChange',
    columns: tableColumns,
    data,
    enableRowSelection: selectable,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    getRowId,
    getSortedRowModel: getSortedRowModel(),
    onColumnPinningChange: updater => {
      const nextValue = resolveUpdater(updater, effectiveColumnPinning);

      if (columnPinning == null) {
        setInternalColumnPinning(nextValue);
      }

      onColumnPinningChange?.(updater);
    },
    onColumnVisibilityChange: updater => {
      const nextValue = resolveUpdater(updater, effectiveColumnVisibility);

      if (columnVisibility == null) {
        setInternalColumnVisibility(nextValue);
      }

      onColumnVisibilityChange?.(updater);
    },
    onRowSelectionChange: updater => {
      const nextValue = resolveUpdater(updater, effectiveRowSelection);

      if (rowSelection == null) {
        setInternalRowSelection(nextValue);
      }

      onRowSelectionChange?.(updater);
    },
    onSortingChange: updater => {
      const nextValue = resolveUpdater(updater, effectiveSorting);

      if (sorting == null) {
        setInternalSorting(nextValue);
      }

      onSortingChange?.(updater);
    },
    state: {
      columnOrder: columnOrder ?? [],
      columnPinning: effectiveColumnPinning,
      columnSizing: columnSizing ?? {},
      columnVisibility: effectiveColumnVisibility,
      pagination: tablePagination,
      rowSelection: effectiveRowSelection,
      sorting: effectiveSorting,
    },
  });

  const colSpan = table.getVisibleLeafColumns().length || 1;
  const selectedCount = Object.keys(effectiveRowSelection).length;
  const pageRowCount = table.getRowModel().rows.length;
  const selectionSummary =
    selectedSummary?.(selectedCount, pageRowCount) ??
    `已选择 ${selectedCount} 条数据`;
  const selectionBarSummary = `已选择 ${selectedCount} 项，本页 ${pageRowCount} 条`;

  function handlePaginationChange(nextPage: number, nextPageSize: number) {
    if (pagination?.current == null) {
      setInternalCurrent(nextPage);
    }

    table.setPageIndex(nextPage - 1);
    table.setPageSize(nextPageSize);
    pagination?.onChange?.(nextPage, nextPageSize);
  }

  return (
    <div
      className={cn(
        'flex min-h-0 flex-col overflow-hidden rounded-md border border-ui-border bg-ui-background text-sm text-ui-foreground',
        className,
      )}
      data-density={resolvedDensity}
      data-slot="data-table"
      {...props}
    >
      <DataTableToolbar
        actions={actions}
        description={description}
        title={title}
      >
        {toolbar}
      </DataTableToolbar>
      <DataTableFilterBar label={filterBarLabel}>{filters}</DataTableFilterBar>
      <DataTableSelectionBar
        selectedCount={selectedCount}
        summary={selectionBarSummary}
      >
        {selectionActions}
      </DataTableSelectionBar>
      <div
        className="min-h-0 flex-1 overflow-auto"
        data-slot="data-table-scroll"
      >
        <table className="w-full min-w-max border-collapse">
          <DataTableHeader
            density={resolvedDensity}
            stickyHeader={stickyHeader}
            table={table}
          />
          <DataTableBody
            colSpan={colSpan}
            density={resolvedDensity}
            empty={empty}
            emptyAction={emptyAction}
            emptyDescription={emptyDescription}
            emptyText={emptyText}
            error={error}
            loading={loading}
            onRetry={onRetry}
            onRowClick={onRowClick}
            renderExpandedRow={renderExpandedRow}
            table={table}
            variant={variant}
          />
        </table>
      </div>
      <DataTableFooter
        currentPage={currentPage}
        onPaginationChange={handlePaginationChange}
        pagination={pagination}
        selectable={selectable}
        selectedSummary={selectionSummary}
      />
    </div>
  );
}
