import {
  flexRender,
  type Header,
  type RowData,
  type Table,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { useId } from 'react';
import { cn } from '../../../internal/cn';
import type { DataTableColumnMeta, DataTableDensity } from './types';
import {
  densityClassName,
  getAlignClassName,
  getAriaSort,
  getPinningClassName,
  getPinningEdgeClassName,
  resolveWidth,
} from './utils';

function DataTableHeaderCell<TData extends RowData>({
  density,
  header,
}: {
  density: DataTableDensity;
  header: Header<TData, unknown>;
}) {
  const meta = header.column.columnDef.meta as DataTableColumnMeta | undefined;
  const pinned = header.column.getIsPinned();
  const isPinnedEdge =
    pinned === 'left'
      ? header.column.getIsLastColumn('left')
      : pinned === 'right'
        ? header.column.getIsFirstColumn('right')
        : false;
  const sort = header.column.getIsSorted();
  const width = resolveWidth(meta?.width);
  const accessory = meta?.headerAccessory;
  const shouldRenderAccessory = accessory != null && !header.isPlaceholder;
  const titleId = useId();
  const titleContent =
    header.isPlaceholder ? null : header.column.getCanSort() ? (
      <button
        className="inline-flex max-w-full items-center gap-1 rounded outline-none hover:text-ui-foreground focus-visible:ring-2 focus-visible:ring-(--ui-button-focus-ring)"
        onClick={header.column.getToggleSortingHandler()}
        type="button"
      >
        <span className="truncate">
          {flexRender(header.column.columnDef.header, header.getContext())}
        </span>
        {sort === 'asc' ? (
          <ArrowUp aria-hidden="true" className="size-3" />
        ) : sort === 'desc' ? (
          <ArrowDown aria-hidden="true" className="size-3" />
        ) : (
          <ChevronsUpDown aria-hidden="true" className="size-3" />
        )}
      </button>
    ) : (
      flexRender(header.column.columnDef.header, header.getContext())
    );

  return (
    <th
      aria-labelledby={shouldRenderAccessory ? titleId : undefined}
      aria-sort={getAriaSort(sort)}
      className={cn(
        'border-ui-border border-b align-middle text-xs text-ui-muted-foreground font-(--ui-data-table-header-font-weight)',
        densityClassName[density].header,
        getAlignClassName(meta?.align),
        getPinningClassName(pinned),
        getPinningEdgeClassName(pinned, isPinnedEdge),
        meta?.headerClassName,
      )}
      colSpan={header.colSpan}
      key={header.id}
      scope="col"
      style={{
        left:
          pinned === 'left' ? `${header.column.getStart('left')}px` : undefined,
        right:
          pinned === 'right'
            ? `${header.column.getAfter('right')}px`
            : undefined,
        width,
      }}
    >
      {shouldRenderAccessory ? (
        <div className="flex items-center justify-between gap-2">
          <span className="min-w-0 truncate" id={titleId}>
            {titleContent}
          </span>
          <span className="flex-none">{accessory}</span>
        </div>
      ) : (
        titleContent
      )}
    </th>
  );
}

export function DataTableHeader<TData extends RowData>({
  density,
  stickyHeader,
  table,
}: {
  density: DataTableDensity;
  stickyHeader: boolean;
  table: Table<TData>;
}) {
  return (
    <thead
      className={cn(
        'bg-(--ui-data-table-header-background)',
        stickyHeader && 'sticky top-0 z-[2]',
      )}
    >
      {table.getHeaderGroups().map(headerGroup => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map(header => (
            <DataTableHeaderCell
              density={density}
              header={header}
              key={header.id}
            />
          ))}
        </tr>
      ))}
    </thead>
  );
}
