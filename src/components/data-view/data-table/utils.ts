import type {
  ColumnPinningState,
  RowData,
  Updater,
} from '@tanstack/react-table';
import type { KeyboardEvent, MouseEvent } from 'react';
import type {
  DataTableColumn,
  DataTableColumnMeta,
  DataTableDensity,
} from './types';

const interactiveRowActivationSelector = [
  'button',
  'a',
  'input',
  'select',
  'textarea',
  '[role="button"]',
  '[data-row-click-ignore]',
].join(',');

export function resolveUpdater<TValue>(
  updater: Updater<TValue>,
  current: TValue,
) {
  return typeof updater === 'function'
    ? (updater as (old: TValue) => TValue)(current)
    : updater;
}

export function resolveWidth(width: DataTableColumnMeta['width']) {
  if (typeof width === 'number') return `${width}px`;

  return width;
}

export function getAlignClassName(align: DataTableColumnMeta['align']) {
  if (align === 'center') return 'text-center';
  if (align === 'right') return 'text-right';

  return 'text-left';
}

export function getPinningClassName(pinned: DataTableColumnMeta['pinned']) {
  if (pinned === 'left') return 'ly-data-table-cell-pinned-left';
  if (pinned === 'right') return 'ly-data-table-cell-pinned-right';
  return '';
}

export function getPinningEdgeClassName(
  pinned: DataTableColumnMeta['pinned'],
  isEdge: boolean,
) {
  if (!isEdge) return '';
  if (pinned === 'left') return 'ly-data-table-cell-pinned-left-edge';
  if (pinned === 'right') return 'ly-data-table-cell-pinned-right-edge';
  return '';
}

export function getAriaSort(sort: false | 'asc' | 'desc') {
  if (sort === false) return undefined;

  return sort === 'desc' ? 'descending' : 'ascending';
}

export function shouldIgnoreRowActivation(
  event: KeyboardEvent<HTMLTableRowElement> | MouseEvent<HTMLTableRowElement>,
) {
  if (event.defaultPrevented) return true;

  const target = event.target;

  if (!(target instanceof Element)) return false;

  const interactiveTarget = target.closest(interactiveRowActivationSelector);

  return (
    interactiveTarget !== null &&
    interactiveTarget !== event.currentTarget &&
    event.currentTarget.contains(interactiveTarget)
  );
}

export function getColumnId<TData extends RowData>(
  column: DataTableColumn<TData>,
  index: number,
) {
  if ('id' in column && column.id != null) return column.id;
  if ('accessorKey' in column && column.accessorKey != null) {
    return String(column.accessorKey);
  }

  return `column-${index}`;
}

export function deriveColumnPinning<TData extends RowData>({
  columns,
  selectable,
}: {
  columns: DataTableColumn<TData>[];
  selectable: boolean;
}): ColumnPinningState {
  const left = selectable ? ['__select__'] : [];
  const right: string[] = [];

  columns.forEach((column, index) => {
    const columnId = getColumnId(column, index);

    if (column.meta?.pinned === 'left') {
      left.push(columnId);
    }

    if (column.meta?.pinned === 'right') {
      right.push(columnId);
    }
  });

  return { left, right };
}

export function getDensity(
  density: DataTableDensity | undefined,
  compact: boolean,
) {
  if (density != null) return density;

  return compact ? 'compact' : 'default';
}

export const densityClassName = {
  comfortable: {
    cell: 'px-3 py-3.5',
    header: 'h-12 px-3',
    loading: 'px-3 py-3.5',
  },
  compact: {
    cell: 'px-2 py-2',
    header: 'h-9 px-2',
    loading: 'px-2 py-2',
  },
  default: {
    cell: 'px-3 py-2.5',
    header: 'h-[38px] px-3',
    loading: 'px-3 py-2.5',
  },
} as const;
