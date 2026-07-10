import * as React from 'react';
import type { TimeUnit } from '../time-columns';
import type { TimeParts, TimePickerValue, TimeRangePickerValue } from './types';

function padTime(value: number) {
  return String(value).padStart(2, '0');
}

export function normalizeTimeParts(parts: Partial<TimeParts>): TimeParts {
  return {
    hour: Math.max(0, Math.min(23, parts.hour ?? 0)),
    minute: Math.max(0, Math.min(59, parts.minute ?? 0)),
    second: Math.max(0, Math.min(59, parts.second ?? 0)),
  };
}

export function parseTime(value: TimePickerValue): TimeParts | undefined {
  if (!value) return undefined;

  const match = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/.exec(value.trim());

  if (!match) return undefined;

  const next = normalizeTimeParts({
    hour: Number(match[1]),
    minute: Number(match[2]),
    second: match[3] == null ? 0 : Number(match[3]),
  });

  if (
    next.hour !== Number(match[1]) ||
    next.minute !== Number(match[2]) ||
    (match[3] != null && next.second !== Number(match[3]))
  ) {
    return undefined;
  }

  return next;
}

export function formatTime(parts: TimeParts, showSecond: boolean) {
  const text = `${padTime(parts.hour)}:${padTime(parts.minute)}`;

  return showSecond ? `${text}:${padTime(parts.second)}` : text;
}

export function getNowParts() {
  const now = new Date();

  return {
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds(),
  };
}

export function updateTimePart(
  parts: TimeParts | undefined,
  unit: TimeUnit,
  value: number,
) {
  return normalizeTimeParts({
    ...(parts ?? getNowParts()),
    [unit]: value,
  });
}

export function useControllableTimeValue({
  defaultValue,
  onValueChange,
  value,
}: {
  defaultValue?: TimePickerValue;
  onValueChange?: (value: TimePickerValue) => void;
  value?: TimePickerValue;
}) {
  const [internalValue, setInternalValue] =
    React.useState<TimePickerValue>(defaultValue);
  const mergedValue = value ?? internalValue;

  const setValue = React.useCallback(
    (nextValue: TimePickerValue) => {
      if (value == null) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [onValueChange, value],
  );

  return [mergedValue, setValue] as const;
}

export function useControllableRangeValue({
  defaultValue,
  onValueChange,
  value,
}: {
  defaultValue?: TimeRangePickerValue;
  onValueChange?: (value: TimeRangePickerValue) => void;
  value?: TimeRangePickerValue;
}) {
  const [internalValue, setInternalValue] =
    React.useState<TimeRangePickerValue>(
      defaultValue ?? [undefined, undefined],
    );
  const mergedValue = value ?? internalValue;

  const setValue = React.useCallback(
    (nextValue: TimeRangePickerValue) => {
      if (value == null) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [onValueChange, value],
  );

  return [mergedValue, setValue] as const;
}
