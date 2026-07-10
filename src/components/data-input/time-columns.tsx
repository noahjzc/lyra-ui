import * as React from 'react';
import { cn } from '../../internal/cn';
import { ScrollArea } from '../general/scroll-area';

export type TimeUnit = 'hour' | 'minute' | 'second';

export type TimeColumnValue = Record<TimeUnit, number>;
export type TimeColumnsVariant = 'date-picker' | 'time-picker';

export interface TimeColumnsProps {
  className?: string;
  disabledTime?: (unit: TimeUnit, value: number) => boolean;
  minuteStep?: number;
  onSelect: (unit: TimeUnit, value: number) => void;
  secondStep?: number;
  showSecond?: boolean;
  value: TimeColumnValue;
  variant?: TimeColumnsVariant;
}

const timeUnitMeta = {
  hour: {
    label: '时',
    max: 23,
    name: '小时',
  },
  minute: {
    label: '分',
    max: 59,
    name: '分钟',
  },
  second: {
    label: '秒',
    max: 59,
    name: '秒',
  },
} as const;

function clampStep(step: number | undefined) {
  if (step == null || !Number.isFinite(step) || step < 1) return 1;

  return Math.max(1, Math.min(60, Math.floor(step)));
}

function getTimeOptions(unit: TimeUnit, step = 1) {
  const normalizedStep = unit === 'hour' ? 1 : clampStep(step);

  return Array.from(
    { length: Math.floor(timeUnitMeta[unit].max / normalizedStep) + 1 },
    (_, index) => index * normalizedStep,
  );
}

function padTime(value: number) {
  return String(value).padStart(2, '0');
}

function getUnitOptions(
  unit: TimeUnit,
  minuteStep: number,
  secondStep: number,
) {
  if (unit === 'minute') return getTimeOptions(unit, minuteStep);
  if (unit === 'second') return getTimeOptions(unit, secondStep);

  return getTimeOptions(unit);
}

function scrollSelectedTimeOptionsIntoView(container: HTMLElement | null) {
  if (!container) return;

  const selectedOptions = Array.from(
    container.querySelectorAll<HTMLElement>('[data-time-selected="true"]'),
  );

  for (const option of selectedOptions) {
    const viewport = option.closest(
      '[data-slot="scroll-area-viewport"]',
    ) as HTMLElement | null;

    if (!viewport || viewport.clientHeight <= 0) continue;

    const maxScrollTop = Math.max(
      0,
      viewport.scrollHeight - viewport.clientHeight,
    );
    const optionHeight = option.offsetHeight || option.clientHeight;
    const nextScrollTop =
      option.offsetTop - (viewport.clientHeight - option.clientHeight) / 2;
    const snappedScrollTop =
      optionHeight > 0
        ? Math.round(nextScrollTop / optionHeight) * optionHeight
        : nextScrollTop;

    viewport.scrollTop = Math.max(0, Math.min(maxScrollTop, snappedScrollTop));
  }
}

const timeColumnsClassName = {
  'date-picker': 'h-[232px] rounded-md',
  'time-picker': 'h-[232px] rounded-md',
} as const satisfies Record<TimeColumnsVariant, string>;

const timeColumnClassName = {
  'date-picker': 'min-w-0 grid-rows-[28px_minmax(0,1fr)]',
  'time-picker': 'min-w-0 grid-rows-[28px_minmax(0,1fr)]',
} as const satisfies Record<TimeColumnsVariant, string>;

const timeColumnHeaderClassName = {
  'date-picker': 'grid min-h-7 place-items-center',
  'time-picker': 'grid min-h-7 place-items-center',
} as const satisfies Record<TimeColumnsVariant, string>;

const timeOptionClassName = {
  'date-picker': 'min-h-[30px] border-(--ui-divider-soft) text-xs',
  'time-picker': 'min-h-[30px] border-(--ui-divider-soft) text-xs',
} as const satisfies Record<TimeColumnsVariant, string>;

const timeOptionLabelClassName = {
  'date-picker': 'min-w-8',
  'time-picker': 'min-w-8',
} as const satisfies Record<TimeColumnsVariant, string>;

const timeColumnsViewportClassName =
  'snap-y snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0';

const timeColumnsScrollAreaClassName =
  'min-h-0 [--ui-scrollbar-thumb:var(--ui-scrollbar-thumb)] [--ui-scrollbar-thumb-hover:var(--ui-scrollbar-thumb-hover)] [--ui-scrollbar-track:transparent] [&_[data-slot=scroll-area-scrollbar]]:absolute [&_[data-slot=scroll-area-scrollbar]]:inset-y-0 [&_[data-slot=scroll-area-scrollbar]]:right-0 [&_[data-slot=scroll-area-scrollbar]]:z-(--ui-layer-local-z-index) [&_[data-slot=scroll-area-scrollbar]]:w-1.5 [&_[data-slot=scroll-area-thumb]]:bg-(--ui-scrollbar-thumb)/80';

export function TimeColumns({
  className,
  disabledTime,
  minuteStep = 1,
  onSelect,
  secondStep = 1,
  showSecond = true,
  value,
  variant = 'time-picker',
}: TimeColumnsProps) {
  const columnsRef = React.useRef<HTMLDivElement>(null);
  const units: TimeUnit[] = showSecond
    ? ['hour', 'minute', 'second']
    : ['hour', 'minute'];

  React.useLayoutEffect(() => {
    const container = columnsRef.current;

    scrollSelectedTimeOptionsIntoView(container);

    const frame = window.requestAnimationFrame(() => {
      scrollSelectedTimeOptionsIntoView(container);
    });

    return () => window.cancelAnimationFrame(frame);
  });

  return (
    <div
      className={cn(
        'grid overflow-hidden border border-(--ui-divider-soft)',
        timeColumnsClassName[variant],
        showSecond ? 'grid-cols-3' : 'grid-cols-2',
        className,
      )}
      data-slot="time-columns"
      data-variant={variant}
      ref={columnsRef}
    >
      {units.map(unit => (
        <div
          className={cn(
            'grid min-h-0 border-(--ui-divider-soft) border-r last:border-r-0',
            timeColumnClassName[variant],
          )}
          data-slot="time-column"
          key={unit}
        >
          <div
            className={cn(
              'border-(--ui-divider-soft) border-b bg-(--ui-surface-muted-background) text-xs font-extrabold text-(--ui-control-muted-foreground)',
              timeColumnHeaderClassName[variant],
            )}
            data-slot="time-column-header"
          >
            {timeUnitMeta[unit].label}
          </div>
          <ScrollArea
            className={timeColumnsScrollAreaClassName}
            scrollHideDelay={120}
            type="hover"
            viewportClassName={timeColumnsViewportClassName}
            viewportProps={{
              'aria-label': `${timeUnitMeta[unit].name}选择列表`,
            }}
          >
            <div className="grid content-start">
              {getUnitOptions(unit, minuteStep, secondStep).map(option => {
                const selected = value[unit] === option;
                const disabled = disabledTime?.(unit, option) ?? false;

                return (
                  <button
                    aria-label={`选择${timeUnitMeta[unit].name} ${padTime(option)}`}
                    aria-pressed={selected}
                    className={cn(
                      'grid snap-start place-items-center border-b text-(--ui-control-foreground) tabular-nums transition-ui-state [scroll-snap-stop:always] hover:bg-(--ui-control-hover-background) hover:text-(--ui-button-default-hover-foreground) last:border-b-0',
                      timeOptionClassName[variant],
                      selected &&
                        'bg-(--ui-button-ghost-background) font-extrabold text-(--ui-button-default-hover-foreground) hover:bg-(--ui-button-ghost-background) hover:text-(--ui-button-default-hover-foreground)',
                      disabled &&
                        'cursor-not-allowed bg-(--ui-control-disabled-background) text-(--ui-control-disabled-foreground) line-through hover:bg-(--ui-control-disabled-background) hover:text-(--ui-control-disabled-foreground)',
                    )}
                    data-slot="time-option"
                    data-time-selected={selected ? true : undefined}
                    disabled={disabled}
                    key={`${unit}-${option}`}
                    onClick={() => onSelect(unit, option)}
                    type="button"
                  >
                    <span
                      className={cn(
                        'grid h-6 place-items-center rounded-md px-1 transition-ui-state',
                        timeOptionLabelClassName[variant],
                      )}
                    >
                      {padTime(option)}
                    </span>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      ))}
    </div>
  );
}
