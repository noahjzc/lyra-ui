import type * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import type { VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import type { radioControlVariants } from './variants';

export type RadioStatus = 'error';
export type RadioSize = NonNullable<
  VariantProps<typeof radioControlVariants>['size']
>;

export interface RadioProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
      'children'
    >,
    VariantProps<typeof radioControlVariants> {
  invalid?: boolean;
  status?: RadioStatus;
}

export interface RadioFieldProps
  extends Omit<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    'children' | 'onChange'
  > {
  card?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  description?: React.ReactNode;
  disabled?: boolean;
  helperText?: React.ReactNode;
  invalid?: boolean;
  label: React.ReactNode;
  name?: string;
  onCheckedChange?: (checked: boolean) => void;
  size?: RadioSize;
  status?: RadioStatus;
  value?: string;
}

export interface RadioOptionFieldProps
  extends Omit<RadioFieldProps, 'checked' | 'defaultChecked' | 'name'> {
  checked?: boolean;
  controlRef?: React.Ref<React.ComponentRef<typeof RadioGroupPrimitive.Item>>;
  id?: string;
  value: string;
}

export interface RadioGroupOption {
  description?: React.ReactNode;
  disabled?: boolean;
  label: React.ReactNode;
  value: string;
}

export interface RadioGroupProps
  extends Omit<
    React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
    'defaultValue' | 'disabled' | 'onChange'
  > {
  columns?: number;
  defaultValue?: string;
  direction?: 'horizontal' | 'vertical' | 'grid';
  disabled?: boolean;
  disabledOptions?: string[];
  helperText?: React.ReactNode;
  invalid?: boolean;
  legend?: React.ReactNode;
  minOptionWidth?: number;
  name?: string;
  onValueChange?: (value: string) => void;
  options: RadioGroupOption[];
  size?: RadioSize;
  status?: RadioStatus;
  value?: string;
  variant?: 'default' | 'card' | 'button';
}
