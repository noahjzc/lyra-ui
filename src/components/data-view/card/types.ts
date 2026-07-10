import type * as React from 'react';

export type CardVariant = 'action' | 'item' | 'plain' | 'summary';
export type CardStatusVariant = 'info' | 'neutral' | 'success' | 'warning';

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  asChild?: boolean;
  disabled?: boolean;
  disabledReason?: React.ReactNode;
  interactive?: boolean;
  loading?: boolean;
  selected?: boolean;
  title?: React.ReactNode;
  variant?: CardVariant;
}

export interface CardStatusProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: CardStatusVariant;
}

export interface CardFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value?: React.ReactNode;
  valueClassName?: string;
}
