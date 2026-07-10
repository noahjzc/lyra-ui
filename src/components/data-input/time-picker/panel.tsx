import { LoaderCircle, RefreshCw } from 'lucide-react';
import type * as React from 'react';
import { cn } from '../../../internal/cn';
import { TimeColumns as TimeColumnsBase, type TimeUnit } from '../time-columns';
import type { RangePart, TimeParts } from './types';
import { formatTime, normalizeTimeParts } from './utils';

export function TimePanel({
  disabledTime,
  loadError,
  loading,
  minuteStep,
  onClear,
  onConfirm,
  onNow,
  onRetry,
  onSelect,
  secondStep,
  showSecond,
  value,
}: {
  disabledTime?: (unit: TimeUnit, value: number, current: TimeParts) => boolean;
  loadError?: React.ReactNode;
  loading?: boolean;
  minuteStep: number;
  onClear: () => void;
  onConfirm: () => void;
  onNow: () => void;
  onRetry?: () => void;
  onSelect: (unit: TimeUnit, value: number) => void;
  secondStep: number;
  showSecond: boolean;
  value?: TimeParts;
}) {
  return (
    <div
      className="grid w-[360px] gap-2.5 rounded-lg border border-(--ui-input-border) bg-ui-background p-3 shadow-(--ui-time-picker-panel-shadow)"
      data-slot="time-picker-panel"
    >
      <PanelHeader showSecond={showSecond} />
      {loading || loadError != null ? (
        <PanelState loadError={loadError} loading={loading} onRetry={onRetry} />
      ) : (
        <TimeColumnsBase
          disabledTime={(unit, next) =>
            disabledTime?.(unit, next, value ?? normalizeTimeParts({})) ?? false
          }
          minuteStep={minuteStep}
          onSelect={onSelect}
          secondStep={secondStep}
          showSecond={showSecond}
          value={value ?? normalizeTimeParts({})}
        />
      )}
      <PanelFooter
        label={value ? formatTime(value, showSecond) : '请选择时间'}
        onClear={onClear}
        onConfirm={onConfirm}
        onNow={onNow}
      />
    </div>
  );
}

export function TimeRangePanel({
  activeParts,
  disabledTime,
  end,
  loadError,
  loading,
  minuteStep,
  onClear,
  onConfirm,
  onNow,
  onRangePartChange,
  onRetry,
  onSelect,
  rangePart,
  secondStep,
  showSecond,
  start,
}: {
  activeParts?: TimeParts;
  disabledTime?: (
    unit: TimeUnit,
    value: number,
    current: TimeParts | undefined,
  ) => boolean;
  end: string | undefined;
  loadError?: React.ReactNode;
  loading?: boolean;
  minuteStep: number;
  onClear: () => void;
  onConfirm: () => void;
  onNow: () => void;
  onRangePartChange: (part: RangePart) => void;
  onRetry?: () => void;
  onSelect: (unit: TimeUnit, value: number) => void;
  rangePart: RangePart;
  secondStep: number;
  showSecond: boolean;
  start: string | undefined;
}) {
  const displayParts = activeParts ?? normalizeTimeParts({});

  return (
    <div
      className="grid w-[360px] gap-2.5 rounded-lg border border-(--ui-input-border) bg-ui-background p-3 shadow-(--ui-time-picker-panel-shadow)"
      data-slot="time-range-picker-panel"
    >
      <div
        className="grid grid-cols-2 gap-1 rounded-lg border border-(--ui-divider-soft) bg-(--ui-input-addon-background) p-[3px]"
        data-slot="time-range-picker-tabs"
      >
        {(['start', 'end'] as const).map(part => {
          const selected = rangePart === part;
          const text = part === 'start' ? start : end;

          return (
            <button
              aria-pressed={selected}
              className={cn(
                'grid min-h-[42px] gap-0.5 rounded-md border border-transparent px-2 py-1.5 text-left text-xs transition-ui-state',
                selected
                  ? 'border-(--ui-control-active-border) bg-ui-background text-(--ui-button-default-hover-foreground) shadow-(--ui-time-preset-active-shadow)'
                  : 'text-ui-muted-foreground hover:bg-ui-background',
              )}
              key={part}
              onClick={() => onRangePartChange(part)}
              type="button"
            >
              <strong>{part === 'start' ? '开始' : '结束'}</strong>
              <span className="truncate">{text ?? '未选择'}</span>
            </button>
          );
        })}
      </div>
      {loading || loadError != null ? (
        <PanelState loadError={loadError} loading={loading} onRetry={onRetry} />
      ) : (
        <TimeColumnsBase
          disabledTime={(unit, next) =>
            disabledTime?.(unit, next, activeParts) ?? false
          }
          minuteStep={minuteStep}
          onSelect={onSelect}
          secondStep={secondStep}
          showSecond={showSecond}
          value={displayParts}
        />
      )}
      <PanelFooter
        label={
          start || end
            ? `${start ?? '开始时间'} → ${end ?? '结束时间'}`
            : '请选择时间范围'
        }
        onClear={onClear}
        onConfirm={onConfirm}
        onNow={onNow}
      />
    </div>
  );
}

function PanelHeader({ showSecond }: { showSecond: boolean }) {
  return (
    <div
      className="flex min-h-8 items-center justify-between gap-3"
      data-slot="time-picker-panel-header"
    >
      <strong className="text-sm text-ui-foreground">选择时间</strong>
      <span className="rounded-md border border-(--ui-input-border) bg-ui-background px-2 py-1 text-xs font-bold text-(--ui-control-foreground)">
        {showSecond ? 'HH:mm:ss' : 'HH:mm'}
      </span>
    </div>
  );
}

function PanelState({
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
      className="grid min-h-[222px] place-items-center rounded-lg border border-dashed border-(--ui-input-border) bg-(--ui-surface-muted-background) px-4 py-6 text-center"
      data-slot={isError ? 'time-picker-load-error' : 'time-picker-loading'}
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
          {isError ? loadError : '正在加载可选时间'}
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

function PanelFooter({
  label,
  onClear,
  onConfirm,
  onNow,
}: {
  label: React.ReactNode;
  onClear: () => void;
  onConfirm: () => void;
  onNow: () => void;
}) {
  return (
    <div
      className="flex min-h-8 items-center justify-between gap-3"
      data-slot="time-picker-footer"
    >
      <span className="min-w-0 truncate text-xs font-medium text-ui-muted-foreground">
        {label}
      </span>
      <span className="inline-flex shrink-0 items-center gap-1.5">
        <button
          className="inline-flex h-7 items-center justify-center rounded-md border border-(--ui-input-border) bg-ui-background px-2.5 text-xs font-bold text-(--ui-control-foreground) transition-ui-state transition-ui-transform hover:bg-(--ui-control-hover-background) hover:text-(--ui-button-default-hover-foreground) active:scale-95"
          onClick={onNow}
          type="button"
        >
          此刻
        </button>
        <button
          className="inline-flex h-7 items-center justify-center rounded-md border border-(--ui-input-border) bg-ui-background px-2.5 text-xs font-bold text-(--ui-control-foreground) transition-ui-state transition-ui-transform hover:bg-(--ui-control-hover-background) hover:text-(--ui-button-default-hover-foreground) active:scale-95"
          onClick={onClear}
          type="button"
        >
          清空
        </button>
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
