import type * as React from 'react';

export type CollapseSize = 'compact' | 'middle';
export type CollapseType = 'multiple' | 'single';
export type CollapseValue = string | string[];
export type CollapseVariant = 'bordered' | 'ghost' | 'plain';

export interface CollapseItem {
  children?: React.ReactNode;
  disabled?: boolean;
  extra?: React.ReactNode;
  key: string;
  loading?: boolean;
  summary?: React.ReactNode;
  title: React.ReactNode;
}

export interface CollapseProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  collapsible?: boolean;
  defaultValue?: CollapseValue;
  items: CollapseItem[];
  onValueChange?: (value: CollapseValue) => void;
  size?: CollapseSize;
  type?: CollapseType;
  value?: CollapseValue;
  variant?: CollapseVariant;
}
