import type { VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import type {
  inputRootVariants,
  textareaResizeClassName,
  textareaRootVariants,
} from './variants';

export interface InputCopyableConfig {
  copiedLabel?: string;
  label?: string;
  onCopy?: (value: string) => void;
}

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'size'>,
    VariantProps<typeof inputRootVariants> {
  allowClear?: boolean;
  copyable?: boolean | InputCopyableConfig;
  invalid?: boolean;
  onClear?: () => void;
  prefix?: React.ReactNode;
  prefixAddon?: React.ReactNode;
  showCount?:
    | boolean
    | ((count: number, maxLength?: number) => React.ReactNode);
  suffix?: React.ReactNode;
  suffixAddon?: React.ReactNode;
}

export interface TextareaAutoSizeConfig {
  maxRows?: number;
  minRows?: number;
}

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'prefix'>,
    VariantProps<typeof textareaRootVariants> {
  allowClear?: boolean;
  autoSize?: boolean | TextareaAutoSizeConfig;
  invalid?: boolean;
  onClear?: () => void;
  resize?: keyof typeof textareaResizeClassName;
  showCount?:
    | boolean
    | ((count: number, maxLength?: number) => React.ReactNode);
}

export type InputNumberValue = number | null;

export interface InputNumberProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      | 'defaultValue'
      | 'max'
      | 'min'
      | 'onChange'
      | 'prefix'
      | 'size'
      | 'step'
      | 'type'
      | 'value'
    >,
    VariantProps<typeof inputRootVariants> {
  controls?: boolean;
  defaultValue?: InputNumberValue;
  formatter?: (value: InputNumberValue) => string;
  invalid?: boolean;
  max?: number;
  min?: number;
  onValueChange?: (value: InputNumberValue) => void;
  parser?: (value: string) => InputNumberValue;
  precision?: number;
  prefix?: React.ReactNode;
  prefixAddon?: React.ReactNode;
  step?: number;
  suffix?: React.ReactNode;
  suffixAddon?: React.ReactNode;
  textAlign?: 'left' | 'right';
  value?: InputNumberValue;
}
