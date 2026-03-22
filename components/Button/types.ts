import type { MouseEvent, ReactNode } from 'react';

export interface ButtonProps {
  /** Button variant style */
  type?: 'primary' | 'secondary' | 'text';
  /** Button size */
  size?: 'mini' | 'small' | 'default' | 'large';
  /** Button content */
  children?: ReactNode;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button is in loading state */
  loading?: boolean;
  /** Button click handler */
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  /** Additional class name */
  className?: string;
  /** HTML button type */
  htmlType?: 'button' | 'submit' | 'reset';
}
