import dayjs, { type Dayjs } from 'dayjs';
import type * as React from 'react';
import type { TimeUnit } from '../time-columns';
import type {
  CalendarCell,
  DatePickerMode,
  DatePickerPreset,
  DatePickerRangeValue,
  DatePickerSingleValue,
  DatePickerValue,
  PanelMode,
} from './types';

export function isRangeMode(mode: DatePickerMode) {
  return mode === 'dateRange' || mode === 'dateTimeRange';
}

export function isTimeMode(mode: DatePickerMode) {
  return mode === 'dateTime' || mode === 'dateTimeRange';
}

export function normalizeRange(value: DatePickerValue): DatePickerRangeValue {
  return Array.isArray(value) ? value : [undefined, undefined];
}

export function parseDate(value: DatePickerSingleValue, fallback = dayjs()) {
  const parsed = value ? dayjs(value) : fallback;

  return parsed.isValid() ? parsed : fallback;
}

export function formatByMode(value: Dayjs, mode: DatePickerMode) {
  if (mode === 'year') return value.format('YYYY 年');
  if (mode === 'month') return value.format('YYYY 年 MM 月');
  if (isTimeMode(mode)) return value.format('YYYY-MM-DD HH:mm:ss');

  return value.format('YYYY-MM-DD');
}

export function serializeByMode(value: Dayjs, mode: DatePickerMode) {
  if (mode === 'year') return value.format('YYYY');
  if (mode === 'month') return value.format('YYYY-MM');
  if (isTimeMode(mode)) return value.format('YYYY-MM-DD HH:mm:ss');

  return value.format('YYYY-MM-DD');
}

export function getPlaceholder(
  mode: DatePickerMode,
  placeholder?: React.ReactNode,
) {
  if (placeholder != null) return placeholder;
  if (mode === 'dateRange') return '开始日期 → 结束日期';
  if (mode === 'dateTime') return '请选择日期时间';
  if (mode === 'dateTimeRange') return '开始时间 → 结束时间';
  if (mode === 'month') return '请选择月份';
  if (mode === 'year') return '请选择年份';

  return '请选择日期';
}

export function getDisplayValue({
  mode,
  placeholder,
  value,
}: {
  mode: DatePickerMode;
  placeholder: React.ReactNode;
  value: DatePickerValue;
}) {
  if (isRangeMode(mode)) {
    const [start, end] = normalizeRange(value);

    if (!start && !end) return placeholder;

    return `${start ?? '开始'} → ${end ?? '结束'}`;
  }

  if (!value || Array.isArray(value)) return placeholder;

  return formatByMode(parseDate(value), mode);
}

export function getInitialPanelMode(mode: DatePickerMode): PanelMode {
  if (mode === 'month') return 'month';
  if (mode === 'year') return 'year';

  return 'date';
}

export function generateCalendarCells(month: Dayjs): CalendarCell[] {
  const firstDay = month.startOf('month');
  const mondayOffset = (firstDay.day() + 6) % 7;
  const startDate = firstDay.subtract(mondayOffset, 'day');

  return Array.from({ length: 42 }, (_, index) => {
    const date = startDate.add(index, 'day');

    return {
      date,
      muted: !date.isSame(month, 'month'),
    };
  });
}

export function getViewDate(mode: DatePickerMode, value: DatePickerValue) {
  const [start] = normalizeRange(value);

  return parseDate(isRangeMode(mode) ? start : (value as string | undefined));
}

export function resolvePresetValue(preset: DatePickerPreset) {
  return typeof preset.value === 'function' ? preset.value() : preset.value;
}

export function rangeIncludes(date: Dayjs, value: DatePickerRangeValue) {
  const [start, end] = value;

  if (!start || !end) return false;

  const startDate = dayjs(start).startOf('day');
  const endDate = dayjs(end).startOf('day');
  const currentDate = date.startOf('day');

  return currentDate.isAfter(startDate) && currentDate.isBefore(endDate);
}

export function getYearRange(viewDate: Dayjs) {
  const startYear = Math.floor(viewDate.year() / 12) * 12;

  return Array.from({ length: 12 }, (_, index) => startYear + index);
}

export function updateTimePart(value: Dayjs, part: TimeUnit, next: number) {
  if (part === 'hour') return value.hour(next);
  if (part === 'minute') return value.minute(next);

  return value.second(next);
}

export function mergeDateWithTime(date: Dayjs, time?: Dayjs) {
  if (!time) return date;

  return date.hour(time.hour()).minute(time.minute()).second(time.second());
}
