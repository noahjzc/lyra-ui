import type * as React from 'react';

export type DescriptionColumn = 1 | 2 | 3 | 4;
export type DescriptionLayout = 'grid' | 'inline';
export type DescriptionSpan = DescriptionColumn | 'full';

export interface DescriptionCopyConfig {
  label?: string;
  text?: string;
}

export interface DescriptionItem {
  className?: string;
  copyText?: string;
  copyable?: boolean | DescriptionCopyConfig;
  emptyText?: React.ReactNode;
  label: React.ReactNode;
  labelClassName?: string;
  span?: DescriptionSpan;
  value?: React.ReactNode;
  valueClassName?: string;
  wrap?: boolean;
}

export interface DescriptionsProps
  extends Omit<React.HTMLAttributes<HTMLDListElement>, 'children' | 'onCopy'> {
  bordered?: boolean;
  columns?: DescriptionColumn;
  compact?: boolean;
  emptyText?: React.ReactNode;
  items: DescriptionItem[];
  layout?: DescriptionLayout;
  onCopy?: (text: string, item: DescriptionItem) => void;
  wrap?: boolean;
}

export interface DescriptionItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onCopy'> {
  bordered?: boolean;
  compact?: boolean;
  emptyText: React.ReactNode;
  item: DescriptionItem;
  layout: DescriptionLayout;
  onCopy?: DescriptionsProps['onCopy'];
  wrap?: boolean;
}
