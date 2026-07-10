import type * as React from 'react';

export type BadgeSize = 'md' | 'sm';
export type BadgePlacement = 'corner' | 'suffix';
export type BadgeVariant =
  | 'assist'
  | 'default'
  | 'destructive'
  | 'info'
  | 'muted'
  | 'neutral'
  | 'processing'
  | 'success'
  | 'warning';

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  children?: React.ReactNode;
  count?: number;
  dot?: boolean;
  offset?: [number, number];
  overflowCount?: number;
  placement?: BadgePlacement;
  showZero?: boolean;
  size?: BadgeSize;
  status?: BadgeVariant;
  variant?: BadgeVariant;
}

export interface BadgeDotProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  offset?: [number, number];
  size?: BadgeSize;
  variant?: BadgeVariant;
}

export interface BadgeCountProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  count: number;
  offset?: [number, number];
  overflowCount?: number;
  placement?: BadgePlacement;
  showZero?: boolean;
  size?: BadgeSize;
  variant?: BadgeVariant;
}
