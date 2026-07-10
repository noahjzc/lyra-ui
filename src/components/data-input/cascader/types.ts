import type { VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import type { cascaderTriggerVariants } from './variants';

export type CascaderStatus = 'error';
export type CascaderPathValue = string[];
export type CascaderValue = CascaderPathValue | CascaderPathValue[] | undefined;
export type CascaderSize = NonNullable<
  VariantProps<typeof cascaderTriggerVariants>['size']
>;

export interface CascaderOption {
  children?: CascaderOption[];
  disabled?: boolean;
  disabledReason?: React.ReactNode;
  isLeaf?: boolean;
  label: React.ReactNode;
  loading?: boolean;
  value: string;
}

export interface CascaderPathOption {
  nodes: CascaderOption[];
  value: CascaderPathValue;
}

export interface CascaderColumn {
  level: number;
  options: CascaderOption[];
  prefix: CascaderPathValue;
}

export interface CascaderProps
  extends Omit<
      React.HTMLAttributes<HTMLDivElement>,
      'defaultValue' | 'onChange'
    >,
    VariantProps<typeof cascaderTriggerVariants> {
  allowClear?: boolean;
  changeOnSelect?: boolean;
  defaultValue?: CascaderValue;
  disabled?: boolean;
  displayRender?: (
    labels: React.ReactNode[],
    selectedOptions: CascaderOption[],
  ) => React.ReactNode;
  emptyText?: React.ReactNode;
  invalid?: boolean;
  loadData?: (selectedOptions: CascaderOption[]) => Promise<void> | void;
  loadingText?: React.ReactNode;
  maxTagCount?: number;
  multiple?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSearchChange?: (value: string) => void;
  onValueChange?: (value: CascaderValue) => void;
  options: CascaderOption[];
  placeholder?: React.ReactNode;
  searchPlaceholder?: string;
  searchValue?: string;
  showSearch?: boolean;
  status?: CascaderStatus;
  value?: CascaderValue;
}
