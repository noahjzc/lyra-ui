import type {
  ColumnDef,
  ColumnPinningState,
  ColumnSizingState,
  OnChangeFn,
  Row,
  RowData,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import type * as React from 'react';

export interface DataTableColumnMeta {
  align?: 'left' | 'center' | 'right';
  className?: string;
  headerClassName?: string;
  headerAccessory?: React.ReactNode;
  pinned?: 'left' | 'right';
  width?: number | string;
}

export type DataTableColumn<TData, TValue = unknown> = ColumnDef<
  TData,
  TValue
> & {
  meta?: DataTableColumnMeta;
};

export interface DataTablePagination {
  compact?: boolean;
  disabled?: boolean;
  current?: number;
  loading?: boolean;
  pageSize: number;
  pageSizeOptions?: number[];
  showJumper?: boolean;
  showPageSize?: boolean;
  showQuickJump?: boolean;
  showTotal?: boolean;
  total: number;
  variant?: 'compact' | 'simple' | 'table';
  onChange?: (current: number, pageSize: number) => void;
}

export type DataTableDensity = 'comfortable' | 'compact' | 'default';

export interface DataTableProps<TData extends RowData>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  actions?: React.ReactNode;
  columnOrder?: string[];
  columnPinning?: ColumnPinningState;
  columnSizing?: ColumnSizingState;
  columnVisibility?: VisibilityState;
  columns: DataTableColumn<TData>[];
  compact?: boolean;
  data: TData[];
  defaultColumnPinning?: ColumnPinningState;
  defaultColumnVisibility?: VisibilityState;
  defaultRowSelection?: RowSelectionState;
  defaultSorting?: SortingState;
  density?: DataTableDensity;
  description?: React.ReactNode;
  empty?: React.ReactNode;
  emptyAction?: React.ReactNode;
  emptyDescription?: React.ReactNode;
  emptyText?: React.ReactNode;
  error?: React.ReactNode;
  filterBarLabel?: string;
  filters?: React.ReactNode;
  getRowId?: (row: TData, index: number) => string;
  loading?: boolean;
  /**
   * 是否使用服务端分页。启用后，`data` 应只包含当前页数据，
   * DataTable 不会再对其做客户端分页。
   */
  manualPagination?: boolean;
  /**
   * 是否使用服务端排序。启用后，DataTable 仅维护和上报排序状态，
   * 不会重新排列 `data`。
   */
  manualSorting?: boolean;
  onColumnPinningChange?: OnChangeFn<ColumnPinningState>;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
  onRetry?: () => void;
  onRowClick?: (row: TData) => void;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  onSortingChange?: OnChangeFn<SortingState>;
  pagination?: DataTablePagination;
  renderExpandedRow?: (row: Row<TData>) => React.ReactNode;
  rowSelection?: RowSelectionState;
  selectable?: boolean;
  selectedSummary?: (
    selectedCount: number,
    pageRowCount: number,
  ) => React.ReactNode;
  selectionActions?: React.ReactNode;
  sorting?: SortingState;
  stickyHeader?: boolean;
  title?: React.ReactNode;
  toolbar?: React.ReactNode;
  variant?: 'log' | 'standard';
}
