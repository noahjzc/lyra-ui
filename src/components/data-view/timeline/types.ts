import type * as React from 'react';

export type TimelineDensity = 'default' | 'compact';
export type TimelineStatus =
  | 'current'
  | 'default'
  | 'done'
  | 'error'
  | 'pending'
  | 'success'
  | 'warning';
export type TimelineVariant = 'default' | 'panel' | 'plain';

export interface TimelineItem {
  ariaLabel?: string;
  content?: React.ReactNode;
  dateTime?: string;
  disabled?: boolean;
  dot?: React.ReactNode;
  href?: string;
  key?: React.Key;
  meta?: React.ReactNode;
  onClick?: () => void;
  rel?: string;
  status?: TimelineStatus;
  target?: React.HTMLAttributeAnchorTarget;
  time?: React.ReactNode;
  title: React.ReactNode;
}

export interface TimelineProps
  extends Omit<React.HTMLAttributes<HTMLOListElement>, 'onClick'> {
  compact?: boolean;
  density?: TimelineDensity;
  empty?: React.ReactNode;
  items: TimelineItem[];
  loading?: boolean;
  variant?: TimelineVariant;
}
