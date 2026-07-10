import dayjs, { type Dayjs } from 'dayjs';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import type { DatePickerMode, DatePickerRangeValue } from './types';
import { generateCalendarCells, getYearRange, rangeIncludes } from './utils';
import { monthLabels, weekDays } from './variants';

export function CalendarPanel({
  disabledDate,
  onSelect,
  rangeValue,
  selectedDate,
  showOutsideDays = true,
  viewDate,
}: {
  disabledDate?: (date: Dayjs) => boolean;
  onSelect: (date: Dayjs) => void;
  rangeValue?: DatePickerRangeValue;
  selectedDate?: Dayjs;
  showOutsideDays?: boolean;
  viewDate: Dayjs;
}) {
  const cells = React.useMemo(
    () => generateCalendarCells(viewDate),
    [viewDate],
  );

  function handleDayKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const offsetByKey: Record<string, number> = {
      ArrowDown: 7,
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      End: 6,
      Home: -6,
    };
    const offset = offsetByKey[event.key];

    if (offset == null) return;

    const days = Array.from(
      event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
        '[data-slot="date-picker-day"]:not(:disabled)',
      ) ?? [],
    );
    const currentIndex = days.indexOf(event.currentTarget);

    if (currentIndex < 0) return;

    event.preventDefault();

    const nextIndex =
      event.key === 'Home'
        ? Math.floor(currentIndex / 7) * 7
        : event.key === 'End'
          ? Math.floor(currentIndex / 7) * 7 + 6
          : currentIndex + offset;

    days[Math.max(0, Math.min(days.length - 1, nextIndex))]?.focus();
  }

  return (
    <div className="grid gap-2" data-slot="date-picker-calendar">
      <div className="grid grid-cols-7 justify-between gap-1 text-center text-xs font-extrabold text-(--ui-control-muted-foreground)">
        {weekDays.map(day => (
          <span className="grid h-6 w-8 place-items-center" key={day}>
            {day}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 justify-between gap-1">
        {cells.map(cell => {
          if (cell.muted && !showOutsideDays) {
            return (
              <span
                aria-hidden="true"
                className="h-[30px] w-8"
                key={cell.date.format('YYYY-MM-DD')}
              />
            );
          }

          const disabled = disabledDate?.(cell.date) ?? false;
          const selected =
            selectedDate?.isSame(cell.date, 'day') ||
            rangeValue?.some(
              value => value && dayjs(value).isSame(cell.date, 'day'),
            );
          const inRange = rangeValue
            ? rangeIncludes(cell.date, rangeValue)
            : false;
          const today = dayjs().isSame(cell.date, 'day');

          return (
            <button
              aria-label={`${cell.date.format('YYYY-MM-DD')}${
                selected ? '，已选择' : ''
              }${disabled ? '，不可选择' : ''}`}
              aria-pressed={selected ? true : undefined}
              className={cn(
                'grid h-[30px] w-8 place-items-center rounded-md border border-transparent text-xs text-(--ui-control-foreground) tabular-nums transition-ui-state transition-ui-transform hover:border-(--ui-accent-soft-border) hover:bg-(--ui-control-hover-background) hover:text-(--ui-button-default-hover-foreground)',
                cell.muted && 'text-(--ui-control-placeholder-foreground)',
                today &&
                  'border-(--ui-control-active-border) text-(--ui-button-default-hover-foreground)',
                inRange &&
                  'border-(--ui-button-ghost-background) bg-(--ui-button-ghost-background) text-(--ui-button-default-hover-foreground)',
                selected &&
                  'border-(--ui-button-primary-background) bg-(--ui-button-primary-background) font-extrabold text-(--ui-inverse-foreground) hover:bg-(--ui-button-primary-background) hover:text-(--ui-inverse-foreground)',
                disabled &&
                  'cursor-not-allowed border-transparent bg-(--ui-control-disabled-background) text-(--ui-control-disabled-foreground) line-through hover:bg-(--ui-control-disabled-background) hover:text-(--ui-control-disabled-foreground)',
              )}
              data-slot="date-picker-day"
              disabled={disabled}
              key={cell.date.format('YYYY-MM-DD')}
              onClick={() => onSelect(cell.date)}
              onKeyDown={handleDayKeyDown}
              type="button"
            >
              {cell.date.date()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MonthPanel({
  mode,
  onSelect,
  selectedDate,
  viewDate,
}: {
  mode: DatePickerMode;
  onSelect: (date: Dayjs) => void;
  selectedDate?: Dayjs;
  viewDate: Dayjs;
}) {
  return (
    <div className="grid grid-cols-3 gap-2" data-slot="date-picker-months">
      {monthLabels.map((month, index) => {
        const date = viewDate.month(index);
        const selected = selectedDate?.isSame(date, 'month');

        return (
          <button
            aria-pressed={selected ? true : undefined}
            className={cn(
              'grid h-[34px] place-items-center rounded-md border border-transparent bg-(--ui-surface-muted-background) text-xs text-(--ui-control-foreground) transition-ui-state transition-ui-transform hover:border-(--ui-accent-soft-border) hover:bg-(--ui-control-hover-background) hover:text-(--ui-button-default-hover-foreground)',
              selected &&
                'border-(--ui-button-primary-background) bg-(--ui-button-primary-background) text-(--ui-inverse-foreground) hover:bg-(--ui-button-primary-background) hover:text-(--ui-inverse-foreground)',
            )}
            key={month}
            onClick={() => onSelect(date)}
            type="button"
          >
            {mode === 'month' ? date.format('YYYY 年 MM 月') : month}
          </button>
        );
      })}
    </div>
  );
}

export function YearPanel({
  mode,
  onSelect,
  selectedDate,
  viewDate,
}: {
  mode: DatePickerMode;
  onSelect: (date: Dayjs) => void;
  selectedDate?: Dayjs;
  viewDate: Dayjs;
}) {
  return (
    <div className="grid grid-cols-3 gap-2" data-slot="date-picker-years">
      {getYearRange(viewDate).map(year => {
        const date = viewDate.year(year);
        const selected = selectedDate?.isSame(date, 'year');

        return (
          <button
            aria-pressed={selected ? true : undefined}
            className={cn(
              'grid h-[34px] place-items-center rounded-md border border-transparent bg-(--ui-surface-muted-background) text-xs text-(--ui-control-foreground) transition-ui-state transition-ui-transform hover:border-(--ui-accent-soft-border) hover:bg-(--ui-control-hover-background) hover:text-(--ui-button-default-hover-foreground)',
              selected &&
                'border-(--ui-button-primary-background) bg-(--ui-button-primary-background) text-(--ui-inverse-foreground) hover:bg-(--ui-button-primary-background) hover:text-(--ui-inverse-foreground)',
            )}
            key={year}
            onClick={() => onSelect(date)}
            type="button"
          >
            {mode === 'year' ? `${year} 年` : year}
          </button>
        );
      })}
    </div>
  );
}
