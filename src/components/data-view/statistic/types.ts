import type * as React from 'react';

export type StatisticSize = 'default' | 'compact' | 'inline';
export type StatisticVariant = 'plain' | 'card' | 'summary' | 'inline';
export type StatisticStatus =
  | 'default'
  | 'empty'
  | 'error'
  | 'not-configured'
  | 'permission'
  | 'stale';
export type StatisticTrendDirection = 'down' | 'neutral' | 'up' | 'warning';

export type StatisticTrend =
  | StatisticTrendDirection
  | {
      direction: StatisticTrendDirection;
      label?: React.ReactNode;
      value?: React.ReactNode;
    };

export interface StatisticProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix' | 'title'> {
  compact?: boolean;
  description?: React.ReactNode;
  emptyText?: React.ReactNode;
  extra?: React.ReactNode;
  formatter?: (value: number | string) => React.ReactNode;
  loading?: boolean;
  meta?: React.ReactNode;
  precision?: number;
  prefix?: React.ReactNode;
  size?: StatisticSize;
  status?: StatisticStatus;
  statusText?: React.ReactNode;
  title: React.ReactNode;
  trend?: StatisticTrend;
  unit?: React.ReactNode;
  value?: number | string | null;
  variant?: StatisticVariant;
}
