import type * as React from 'react';

export type FormLayout = 'horizontal' | 'inline' | 'vertical';
export type FormRequiredMark = boolean | 'optional';
export type FormSize = 'large' | 'middle' | 'small';
export type FormValidateStatus = 'error' | 'success' | 'validating' | 'warning';

export interface FormColumnConfig {
  offset?: number | string;
  span?: number;
  width?: number | string;
}

export interface FormContextValue {
  disabled?: boolean;
  hasFeedback?: boolean;
  labelCol?: FormColumnConfig;
  labelWrap?: boolean;
  layout: FormLayout;
  readOnly?: boolean;
  readonly?: boolean;
  requiredMark: FormRequiredMark;
  size: FormSize;
  wrapperCol?: FormColumnConfig;
}

export interface FormItemContextValue {
  descriptionId?: string;
  disabled?: boolean;
  error?: boolean;
  fieldId: string;
  messageId?: string;
  readOnly?: boolean;
  readonly?: boolean;
  validateStatus?: FormValidateStatus;
}

export interface FormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'size'> {
  disabled?: boolean;
  hasFeedback?: boolean;
  labelCol?: FormColumnConfig;
  labelWrap?: boolean;
  layout?: FormLayout;
  readOnly?: boolean;
  readonly?: boolean;
  requiredMark?: FormRequiredMark;
  size?: FormSize;
  wrapperCol?: FormColumnConfig;
}

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  controlId?: string;
  disabled?: boolean;
  error?: React.ReactNode;
  extra?: React.ReactNode;
  hasFeedback?: boolean;
  help?: React.ReactNode;
  label?: React.ReactNode;
  labelCol?: FormColumnConfig;
  name?: string;
  optional?: boolean;
  required?: boolean;
  readOnly?: boolean;
  readonly?: boolean;
  span?: 1 | 2 | 3 | 'full';
  validateStatus?: FormValidateStatus;
  wrapperCol?: FormColumnConfig;
}

export interface FormLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  optional?: boolean;
  required?: boolean;
}

export interface FormControlProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

export type FormDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;
export type FormExtraProps = React.HTMLAttributes<HTMLDivElement>;

export interface FormMessageProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  status?: FormValidateStatus;
}

export interface FormFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  alignWithControls?: boolean;
  justify?: 'between' | 'end' | 'start';
}

export interface FormSectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  actions?: React.ReactNode;
  description?: React.ReactNode;
  title?: React.ReactNode;
}

export interface FormGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3;
}

export interface FormReadonlyValueProps
  extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: React.ReactNode;
  value?: React.ReactNode;
}
