import type * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import type { VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import type { checkboxVariants } from './variants';

export type CheckboxStatus = 'error';
export type CheckboxSize = NonNullable<
  VariantProps<typeof checkboxVariants>['size']
>;
export type CheckboxCheckedState = NonNullable<
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>['checked']
>;

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {
  invalid?: boolean;
  status?: CheckboxStatus;
}

export interface CheckboxFieldProps
  extends Omit<CheckboxProps, 'children' | 'size'> {
  card?: boolean;
  description?: React.ReactNode;
  helperText?: React.ReactNode;
  label: React.ReactNode;
  size?: CheckboxSize;
}

export interface CheckboxGroupOption {
  description?: React.ReactNode;
  disabled?: boolean;
  label: React.ReactNode;
  value: string;
}

export interface CheckboxGroupProps
  extends Omit<
    React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
    'defaultValue' | 'disabled' | 'onChange'
  > {
  card?: boolean;
  columns?: number;
  defaultValue?: string[];
  direction?: 'horizontal' | 'vertical' | 'grid';
  disabled?: boolean;
  disabledOptions?: string[];
  helperText?: React.ReactNode;
  invalid?: boolean;
  legend?: React.ReactNode;
  minOptionWidth?: number;
  onValueChange?: (value: string[]) => void;
  options: CheckboxGroupOption[];
  size?: CheckboxSize;
  status?: CheckboxStatus;
  value?: string[];
}
