import type { VariantProps } from 'class-variance-authority';
import type { Dayjs } from 'dayjs';
import type * as React from 'react';
import type { TimeUnit } from '../time-columns';
import type { datePickerTriggerVariants } from './variants';

export type DatePickerMode =
  | 'date'
  | 'dateRange'
  | 'dateTime'
  | 'dateTimeRange'
  | 'month'
  | 'year';
export type DatePickerStatus = 'error';
export type DatePickerSize = NonNullable<
  VariantProps<typeof datePickerTriggerVariants>['size']
>;
export type DatePickerSingleValue = string | undefined;
export type DatePickerRangeValue = [
  DatePickerSingleValue,
  DatePickerSingleValue,
];
export type DatePickerValue = DatePickerRangeValue | DatePickerSingleValue;

export interface DatePickerPreset {
  label: React.ReactNode;
  value: DatePickerRangeValue | (() => DatePickerRangeValue);
}

export interface DatePickerProps
  extends Omit<
      React.HTMLAttributes<HTMLDivElement>,
      'defaultValue' | 'onChange'
    >,
    VariantProps<typeof datePickerTriggerVariants> {
  allowClear?: boolean;
  defaultValue?: DatePickerValue;
  disabled?: boolean;
  disabledDate?: (date: Dayjs) => boolean;
  disabledTime?: (date: Dayjs, part: TimeUnit, value: number) => boolean;
  invalid?: boolean;
  loadError?: React.ReactNode;
  loading?: boolean;
  mode?: DatePickerMode;
  onOpenChange?: (open: boolean) => void;
  onRetry?: () => void;
  onValueChange?: (value: DatePickerValue) => void;
  placeholder?: React.ReactNode;
  presets?: DatePickerPreset[];
  status?: DatePickerStatus;
  triggerAriaLabel?: string;
  value?: DatePickerValue;
}

export interface DateRangePickerProps
  extends Omit<
    DatePickerProps,
    'defaultValue' | 'mode' | 'onValueChange' | 'value'
  > {
  defaultValue?: DatePickerRangeValue;
  mode?: 'dateRange' | 'dateTimeRange';
  onValueChange?: (value: DatePickerRangeValue) => void;
  value?: DatePickerRangeValue;
}

export type CalendarCell = {
  date: Dayjs;
  muted: boolean;
};

export type PanelMode = 'date' | 'month' | 'year';
export type RangePart = 'end' | 'start';
