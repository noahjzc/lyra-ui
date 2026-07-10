import type * as SelectPrimitive from '@radix-ui/react-select';
import type { VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import type { selectTriggerVariants } from './variants';

export type SelectOptionValue = string;

export interface SelectOption {
  description?: React.ReactNode;
  disabled?: boolean;
  disabledReason?: React.ReactNode;
  label: React.ReactNode;
  value: SelectOptionValue;
}

export interface SelectOptionGroup {
  label: React.ReactNode;
  options: SelectOption[];
}

export type SelectStatus = 'error';

export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {
  invalid?: boolean;
}

export interface SelectFieldProps
  extends Omit<
      React.HTMLAttributes<HTMLDivElement>,
      'defaultValue' | 'onChange'
    >,
    VariantProps<typeof selectTriggerVariants> {
  clearable?: boolean;
  defaultValue?: SelectOptionValue;
  disabled?: boolean;
  emptyText?: React.ReactNode;
  groups?: SelectOptionGroup[];
  invalid?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSearchChange?: (value: string) => void;
  onValueChange?: (value: SelectOptionValue | undefined) => void;
  options?: SelectOption[];
  placeholder?: React.ReactNode;
  renderOption?: (option: SelectOption) => React.ReactNode;
  searchPlaceholder?: string;
  searchable?: boolean;
  searchValue?: string;
  status?: SelectStatus;
  triggerAriaLabel?: string;
  value?: SelectOptionValue;
}

export interface MultiSelectProps
  extends Omit<SelectFieldProps, 'defaultValue' | 'onValueChange' | 'value'>,
    VariantProps<typeof selectTriggerVariants> {
  defaultValue?: SelectOptionValue[];
  maxTagCount?: number;
  onValueChange?: (value: SelectOptionValue[]) => void;
  value?: SelectOptionValue[];
}

export interface RemoteSelectProps
  extends Omit<
    SelectFieldProps,
    | 'emptyText'
    | 'groups'
    | 'onSearchChange'
    | 'options'
    | 'searchValue'
    | 'searchable'
  > {
  debounceMs?: number;
  emptyText?: React.ReactNode;
  errorText?: React.ReactNode;
  loadOptions: (keyword: string) => Promise<SelectOption[]>;
  loadingText?: React.ReactNode;
  selectedOption?: SelectOption;
}
