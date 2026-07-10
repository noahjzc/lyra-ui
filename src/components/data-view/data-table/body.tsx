import {
  flexRender,
  type Row,
  type RowData,
  type Table,
} from '@tanstack/react-table';
import { RotateCw } from 'lucide-react';
import { cn } from '../../../internal/cn';
import { Button } from '../../general';
import { Empty } from '../empty';
import type {
  DataTableColumnMeta,
  DataTableDensity,
  DataTableProps,
} from './types';
import {
  densityClassName,
  getAlignClassName,
  getPinningClassName,
  getPinningEdgeClassName,
  resolveWidth,
  shouldIgnoreRowActivation,
} from './utils';

function DataTableLoadingRows({
  colSpan,
  density,
}: {
  colSpan: number;
  density: DataTableDensity;
}) {
  return (
    <>
      {Array.from({ length: density === 'compact' ? 3 : 5 }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: 加载占位行是固定的，无可用业务标识。
        <tr key={`loading-${index}`}>
          <td
            className={cn(
              'border-ui-border border-b',
              densityClassName[density].loading,
            )}
            colSpan={colSpan}
          >
            <div className="h-4 w-full animate-pulse rounded bg-ui-muted motion-reduce:animate-none" />
          </td>
        </tr>
      ))}
    </>
  );
}

function DataTableErrorRow({
  colSpan,
  error,
  onRetry,
}: {
  colSpan: number;
  error: React.ReactNode;
  onRetry?: () => void;
}) {
  return (
    <tr>
      <td className="border-ui-border border-b px-3 py-10" colSpan={colSpan}>
        <Empty
          action={
            onRetry != null ? (
              <Button
                icon={<RotateCw className="size-3.5" />}
                onClick={onRetry}
                size="small"
                variant="ghost"
              >
                重试
              </Button>
            ) : undefined
          }
          compact
          description="接口超时，请重试或检查筛选条件。"
          title={error}
          type="error-empty"
        />
      </td>
    </tr>
  );
}

function DataTableEmptyRow<TData extends RowData>({
  colSpan,
  empty,
  emptyAction,
  emptyDescription,
  emptyText,
}: {
  colSpan: number;
  empty?: React.ReactNode;
  emptyAction?: React.ReactNode;
  emptyDescription?: React.ReactNode;
  emptyText: DataTableProps<TData>['emptyText'];
}) {
  return (
    <tr>
      <td className="border-ui-border border-b px-3 py-8" colSpan={colSpan}>
        {empty ?? (
          <Empty
            action={emptyAction}
            compact
            description={emptyDescription ?? null}
            title={emptyText}
            type="no-data"
          />
        )}
      </td>
    </tr>
  );
}

function DataTableDataRow<TData extends RowData>({
  density,
  onRowClick,
  renderExpandedRow,
  row,
  variant,
  visibleColumnCount,
}: {
  density: DataTableDensity;
  onRowClick?: (row: TData) => void;
  renderExpandedRow?: (row: Row<TData>) => React.ReactNode;
  row: Row<TData>;
  variant: DataTableProps<TData>['variant'];
  visibleColumnCount: number;
}) {
  const expandedContent = renderExpandedRow?.(row);

  return (
    <>
      <tr
        className={cn(
          'border-ui-border border-b transition-ui-state last:border-b-0 hover:bg-(--ui-data-table-row-hover-background)',
          row.getIsSelected() && 'bg-(--ui-button-ghost-background)',
          onRowClick && 'cursor-pointer',
        )}
        data-selected={row.getIsSelected() ? true : undefined}
        onClick={event => {
          if (!onRowClick || shouldIgnoreRowActivation(event)) {
            return;
          }

          onRowClick(row.original);
        }}
        onKeyDown={event => {
          if (
            !onRowClick ||
            shouldIgnoreRowActivation(event) ||
            (event.key !== 'Enter' && event.key !== ' ')
          ) {
            return;
          }

          event.preventDefault();
          onRowClick(row.original);
        }}
        tabIndex={onRowClick ? 0 : undefined}
      >
        {row.getVisibleCells().map(cell => {
          const meta = cell.column.columnDef.meta as
            | DataTableColumnMeta
            | undefined;
          const pinned = cell.column.getIsPinned();
          const isPinnedEdge =
            pinned === 'left'
              ? cell.column.getIsLastColumn('left')
              : pinned === 'right'
                ? cell.column.getIsFirstColumn('right')
                : false;
          const width = resolveWidth(meta?.width);

          return (
            <td
              className={cn(
                'max-w-[360px] border-ui-border/60 align-middle',
                densityClassName[density].cell,
                variant === 'log' && 'py-2 text-xs',
                getAlignClassName(meta?.align),
                getPinningClassName(pinned),
                getPinningEdgeClassName(pinned, isPinnedEdge),
                meta?.className,
              )}
              key={cell.id}
              style={{
                left:
                  pinned === 'left'
                    ? `${cell.column.getStart('left')}px`
                    : undefined,
                right:
                  pinned === 'right'
                    ? `${cell.column.getAfter('right')}px`
                    : undefined,
                width,
              }}
            >
              <div className="min-w-0 truncate">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            </td>
          );
        })}
      </tr>
      {expandedContent != null && (
        <tr className="border-ui-border border-b bg-(--ui-input-filled-background)">
          <td className="px-3 py-2" colSpan={visibleColumnCount}>
            <div
              className="flex min-w-0 flex-wrap gap-x-4 gap-y-1 rounded-md bg-ui-muted/45 px-3 py-2 text-xs text-ui-muted-foreground"
              data-slot="data-table-expanded-row"
            >
              {expandedContent}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function DataTableBody<TData extends RowData>({
  colSpan,
  density,
  empty,
  emptyAction,
  emptyDescription,
  emptyText,
  error,
  loading,
  onRetry,
  onRowClick,
  renderExpandedRow,
  table,
  variant,
}: {
  colSpan: number;
  density: DataTableDensity;
  empty?: React.ReactNode;
  emptyAction?: React.ReactNode;
  emptyDescription?: React.ReactNode;
  emptyText: DataTableProps<TData>['emptyText'];
  error?: React.ReactNode;
  loading: boolean;
  onRetry?: () => void;
  onRowClick?: (row: TData) => void;
  renderExpandedRow?: (row: Row<TData>) => React.ReactNode;
  table: Table<TData>;
  variant: DataTableProps<TData>['variant'];
}) {
  const rows = table.getRowModel().rows;

  return (
    <tbody>
      {loading ? (
        <DataTableLoadingRows colSpan={colSpan} density={density} />
      ) : error != null ? (
        <DataTableErrorRow colSpan={colSpan} error={error} onRetry={onRetry} />
      ) : rows.length === 0 ? (
        <DataTableEmptyRow
          colSpan={colSpan}
          empty={empty}
          emptyAction={emptyAction}
          emptyDescription={emptyDescription}
          emptyText={emptyText}
        />
      ) : (
        rows.map(row => (
          <DataTableDataRow
            density={density}
            key={row.id}
            onRowClick={onRowClick}
            renderExpandedRow={renderExpandedRow}
            row={row}
            variant={variant}
            visibleColumnCount={colSpan}
          />
        ))
      )}
    </tbody>
  );
}
