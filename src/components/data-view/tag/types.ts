import type * as React from 'react';

export type TagColor =
  | 'assist'
  | 'destructive'
  | 'info'
  | 'neutral'
  | 'primary'
  | 'processing'
  | 'success'
  | 'warning';

export type TagSize = 'compact' | 'large' | 'middle';
export type TagVariant = 'category' | 'filter' | 'status';

export interface TagProps
  extends Omit<
    React.HTMLAttributes<HTMLButtonElement | HTMLSpanElement>,
    'color' | 'onClick'
  > {
  checkable?: boolean;
  checked?: boolean;
  children?: React.ReactNode;
  closable?: boolean;
  closeLabel?: string;
  color?: TagColor;
  defaultChecked?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  maxWidth?: number | string;
  onCheckedChange?: (checked: boolean) => void;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLSpanElement>;
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
  size?: TagSize;
  variant?: TagVariant;
}

export interface TagContentProps
  extends Pick<
    TagProps,
    'children' | 'closeLabel' | 'closable' | 'disabled' | 'icon' | 'onClose'
  > {}

export interface TagFilterProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children' | 'onChange'> {
  closeLabel?: string;
  disabled?: boolean;
  label: React.ReactNode;
  maxWidth?: number | string;
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
  operator?: React.ReactNode;
  size?: Exclude<TagSize, 'large'>;
  value: React.ReactNode;
}
