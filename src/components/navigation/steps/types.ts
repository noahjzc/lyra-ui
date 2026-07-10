import type * as React from 'react';

export type StepsOrientation = 'horizontal' | 'vertical';
export type StepsVariant = 'default' | 'compact' | 'progress';
export type StepStatus = 'wait' | 'process' | 'finish' | 'error';

export interface StepItem {
  description?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  key?: React.Key;
  status?: StepStatus;
  title: React.ReactNode;
}

export interface StepsProps
  extends Omit<
    React.HTMLAttributes<HTMLOListElement>,
    'children' | 'onChange'
  > {
  clickable?: boolean;
  current?: number;
  items: StepItem[];
  onCurrentChange?: (current: number) => void;
  orientation?: StepsOrientation;
  status?: StepStatus;
  variant?: StepsVariant;
}

export interface NormalizedStepItem extends StepItem {
  clickable: boolean;
  index: number;
  isCurrent: boolean;
  isLast: boolean;
  status: StepStatus;
}
