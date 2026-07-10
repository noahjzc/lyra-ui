import type { Dayjs } from 'dayjs';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LoaderCircle,
  RefreshCw,
} from 'lucide-react';
import type * as React from 'react';
import type { PanelMode } from './types';
import { getYearRange } from './utils';

export function RangeCalendarHeader({
  onMonthChange,
  viewDate,
}: {
  onMonthChange: (date: Dayjs) => void;
  viewDate: Dayjs;
}) {
  const nextMonth = viewDate.add(1, 'month');

  return (
    <div
      className="grid min-h-8 grid-cols-[64px_minmax(0,1fr)_64px] items-center gap-3"
      data-slot="date-range-calendar-header"
    >
      <span className="inline-flex items-center gap-1">
        <button
          aria-label="上一年"
          className="grid size-7 place-items-center rounded-md border border-transparent text-(--ui-control-muted-foreground) transition-ui-state hover:border-(--ui-accent-soft-border) hover:bg-(--ui-control-hover-background) hover:text-(--ui-button-default-hover-foreground)"
          onClick={() => onMonthChange(viewDate.subtract(1, 'year'))}
          type="button"
        >
          <ChevronsLeft aria-hidden="true" className="size-4" />
        </button>
        <button
          aria-label="上一个月"
          className="grid size-7 place-items-center rounded-md border border-transparent text-(--ui-control-muted-foreground) transition-ui-state hover:border-(--ui-accent-soft-border) hover:bg-(--ui-control-hover-background) hover:text-(--ui-button-default-hover-foreground)"
          onClick={() => onMonthChange(viewDate.subtract(1, 'month'))}
          type="button"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </button>
      </span>
      <span className="grid grid-cols-2 gap-3 text-center text-sm font-extrabold text-ui-foreground">
        <strong>{viewDate.format('YYYY 年 MM 月')}</strong>
        <strong>{nextMonth.format('YYYY 年 MM 月')}</strong>
      </span>
      <span className="inline-flex items-center justify-end gap-1">
        <button
          aria-label="下一个月"
          className="grid size-7 place-items-center rounded-md border border-transparent text-(--ui-control-muted-foreground) transition-ui-state hover:border-(--ui-accent-soft-border) hover:bg-(--ui-control-hover-background) hover:text-(--ui-button-default-hover-foreground)"
          onClick={() => onMonthChange(viewDate.add(1, 'month'))}
          type="button"
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </button>
        <button
          aria-label="下一年"
          className="grid size-7 place-items-center rounded-md border border-transparent text-(--ui-control-muted-foreground) transition-ui-state hover:border-(--ui-accent-soft-border) hover:bg-(--ui-control-hover-background) hover:text-(--ui-button-default-hover-foreground)"
          onClick={() => onMonthChange(viewDate.add(1, 'year'))}
          type="button"
        >
          <ChevronsRight aria-hidden="true" className="size-4" />
        </button>
      </span>
    </div>
  );
}

export function PanelHeader({
  mode,
  onMonthChange,
  onPanelModeChange,
  viewDate,
}: {
  mode: PanelMode;
  onMonthChange: (date: Dayjs) => void;
  onPanelModeChange: (mode: PanelMode) => void;
  viewDate: Dayjs;
}) {
  const offsetUnit = mode === 'year' ? 'year' : 'month';
  const offsetCount = mode === 'year' ? 12 : 1;

  return (
    <div
      className="flex min-h-7 items-center justify-between gap-2"
      data-slot="date-picker-header"
    >
      <button
        aria-label="上一个面板"
        className="grid size-7 place-items-center rounded-md border border-(--ui-divider-soft) bg-(--ui-surface-muted-background) text-(--ui-control-muted-foreground) transition-ui-state hover:bg-(--ui-control-hover-background) hover:text-(--ui-button-default-hover-foreground)"
        onClick={() =>
          onMonthChange(viewDate.subtract(offsetCount, offsetUnit))
        }
        type="button"
      >
        <ChevronLeft aria-hidden="true" className="size-4" />
      </button>
      {mode === 'year' ? (
        <button
          className="rounded-md px-2 text-sm font-extrabold text-ui-foreground transition-ui-state hover:bg-ui-muted"
          onClick={() => onPanelModeChange('year')}
          type="button"
        >
          {getYearRange(viewDate)[0]} - {getYearRange(viewDate).at(-1)}
        </button>
      ) : (
        <span className="inline-flex items-center gap-1">
          <button
            className="inline-flex min-h-7 items-center rounded-md border border-transparent bg-(--ui-surface-muted-background) px-2 text-xs font-extrabold text-ui-foreground transition-ui-state hover:border-(--ui-accent-soft-border) hover:bg-(--ui-control-hover-background) hover:text-(--ui-button-default-hover-foreground)"
            onClick={() => onPanelModeChange('year')}
            type="button"
          >
            {viewDate.format('YYYY 年')}
          </button>
          <button
            className="inline-flex min-h-7 items-center rounded-md border border-transparent bg-(--ui-surface-muted-background) px-2 text-xs font-extrabold text-ui-foreground transition-ui-state hover:border-(--ui-accent-soft-border) hover:bg-(--ui-control-hover-background) hover:text-(--ui-button-default-hover-foreground)"
            onClick={() => onPanelModeChange('month')}
            type="button"
          >
            {viewDate.format('MM 月')}
          </button>
        </span>
      )}
      <button
        aria-label="下一个面板"
        className="grid size-7 place-items-center rounded-md border border-(--ui-divider-soft) bg-(--ui-surface-muted-background) text-(--ui-control-muted-foreground) transition-ui-state hover:bg-(--ui-control-hover-background) hover:text-(--ui-button-default-hover-foreground)"
        onClick={() => onMonthChange(viewDate.add(offsetCount, offsetUnit))}
        type="button"
      >
        <ChevronRight aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}

export function PanelState({
  loadError,
  loading,
  onRetry,
}: {
  loadError?: React.ReactNode;
  loading?: boolean;
  onRetry?: () => void;
}) {
  const isError = loadError != null && !loading;

  return (
    <output
      aria-live="polite"
      className="grid min-h-[238px] place-items-center rounded-lg border border-dashed border-(--ui-input-border) bg-(--ui-surface-muted-background) px-4 py-6 text-center"
      data-slot={isError ? 'date-picker-load-error' : 'date-picker-loading'}
    >
      <div className="grid justify-items-center gap-2">
        {isError ? (
          <RefreshCw
            aria-hidden="true"
            className="size-4 text-(--ui-button-default-hover-foreground)"
          />
        ) : (
          <LoaderCircle
            aria-hidden="true"
            className="size-4 animate-spin text-(--ui-button-default-hover-foreground) motion-reduce:animate-none"
          />
        )}
        <span className="text-xs font-medium text-ui-muted-foreground">
          {isError ? loadError : '正在加载可选日期'}
        </span>
        {isError && onRetry ? (
          <button
            className="inline-flex h-7 items-center justify-center rounded-md border border-(--ui-input-border) bg-ui-background px-2.5 text-xs font-bold text-(--ui-control-foreground) transition-ui-state transition-ui-transform hover:bg-(--ui-control-hover-background) hover:text-(--ui-button-default-hover-foreground) active:scale-95"
            onClick={onRetry}
            type="button"
          >
            重试
          </button>
        ) : null}
      </div>
    </output>
  );
}

export function PanelFooter({
  label,
  onClear,
  onConfirm,
  onToday,
}: {
  label: React.ReactNode;
  onClear?: () => void;
  onConfirm: () => void;
  onToday?: () => void;
}) {
  return (
    <div
      className="flex min-h-8 items-center justify-between gap-3"
      data-slot="date-picker-footer"
    >
      <span className="min-w-0 truncate text-xs font-medium text-ui-muted-foreground">
        {label}
      </span>
      <span className="inline-flex shrink-0 items-center gap-1.5">
        {onToday ? (
          <button
            className="inline-flex h-7 items-center justify-center rounded-md border border-(--ui-input-border) bg-ui-background px-2.5 text-xs font-bold text-(--ui-control-foreground) transition-ui-state transition-ui-transform hover:bg-(--ui-control-hover-background) hover:text-(--ui-button-default-hover-foreground) active:scale-95"
            onClick={onToday}
            type="button"
          >
            今天
          </button>
        ) : null}
        {onClear ? (
          <button
            className="inline-flex h-7 items-center justify-center rounded-md border border-(--ui-input-border) bg-ui-background px-2.5 text-xs font-bold text-(--ui-control-foreground) transition-ui-state transition-ui-transform hover:bg-(--ui-control-hover-background) hover:text-(--ui-button-default-hover-foreground) active:scale-95"
            onClick={onClear}
            type="button"
          >
            清空
          </button>
        ) : null}
        <button
          className="inline-flex h-7 items-center justify-center rounded-md border border-(--ui-button-primary-background) bg-(--ui-button-primary-background) px-2.5 text-xs font-bold text-(--ui-inverse-foreground) transition-ui-state transition-ui-transform hover:border-(--ui-button-default-hover-foreground) hover:bg-(--ui-button-default-hover-foreground) active:scale-95"
          onClick={onConfirm}
          type="button"
        >
          确定
        </button>
      </span>
    </div>
  );
}
