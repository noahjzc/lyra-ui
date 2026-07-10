import type { VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import type { searchInputRootVariants } from './variants';

export type SearchInputStatus = 'error';
export type SearchInputSize = NonNullable<
  VariantProps<typeof searchInputRootVariants>['size']
>;

export interface SearchInputProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      'defaultValue' | 'onSubmit' | 'size' | 'value'
    >,
    VariantProps<typeof searchInputRootVariants> {
  allowClear?: boolean;
  defaultValue?: string;
  invalid?: boolean;
  loading?: boolean;
  onClear?: () => void;
  onSearch?: (value: string) => void;
  onValueChange?: (value: string) => void;
  searchButton?: boolean | React.ReactNode;
  shortcut?: React.ReactNode;
  status?: SearchInputStatus;
  value?: string;
}
