import type * as React from 'react';

export type EmptyType =
  | 'error-empty'
  | 'no-data'
  | 'no-permission'
  | 'no-result'
  | 'not-configured';

export interface EmptyProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  action?: React.ReactNode;
  compact?: boolean;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  type?: EmptyType;
}
