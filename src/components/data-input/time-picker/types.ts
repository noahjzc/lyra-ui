import type { VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import type { TimeUnit } from '../time-columns';
import type { timePickerTriggerVariants } from './variants';

export type TimePickerFormat = 'HH:mm' | 'HH:mm:ss';
export type TimePickerStatus = 'error';
export type TimePickerValue = string | undefined;
export type TimeRangePickerValue = [TimePickerValue, TimePickerValue];
export type TimePickerSize = NonNullable<
  VariantProps<typeof timePickerTriggerVariants>['size']
>;
export type RangePart = 'end' | 'start';

export interface TimeParts {
  hour: number;
  minute: number;
  second: number;
}

export interface TimePickerProps
  extends Omit<
      React.HTMLAttributes<HTMLDivElement>,
      'defaultValue' | 'onChange'
    >,
    VariantProps<typeof timePickerTriggerVariants> {
  allowClear?: boolean;
  defaultValue?: TimePickerValue;
  disabled?: boolean;
  disabledTime?: (unit: TimeUnit, value: number, current: TimeParts) => boolean;
  format?: TimePickerFormat;
  invalid?: boolean;
  loadError?: React.ReactNode;
  loading?: boolean;
  minuteStep?: number;
  onOpenChange?: (open: boolean) => void;
  onRetry?: () => void;
  onValueChange?: (value: TimePickerValue) => void;
  placeholder?: React.ReactNode;
  secondStep?: number;
  showSecond?: boolean;
  status?: TimePickerStatus;
  value?: TimePickerValue;
}

export interface TimeRangePickerProps
  extends Omit<
    TimePickerProps,
    'defaultValue' | 'disabledTime' | 'onValueChange' | 'placeholder' | 'value'
  > {
  defaultValue?: TimeRangePickerValue;
  disabledTime?: (
    unit: TimeUnit,
    value: number,
    current: TimeParts | undefined,
  ) => boolean;
  onValueChange?: (value: TimeRangePickerValue) => void;
  placeholder?: [React.ReactNode, React.ReactNode] | React.ReactNode;
  value?: TimeRangePickerValue;
}
