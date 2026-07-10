import { Loader2, type LucideIcon } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../internal/cn';

export type IconTone =
  | 'neutral'
  | 'primary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'disabled';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon?: LucideIcon;
  label?: string;
  loading?: boolean;
  size?: 14 | 16 | 18 | 20 | 24 | number;
  strokeWidth?: number;
  tone?: IconTone;
}

const iconToneClassName = {
  danger: 'text-ui-destructive',
  disabled: 'text-ui-muted-foreground opacity-60',
  info: 'text-(--ui-icon-info-foreground)',
  neutral: 'text-ui-muted-foreground',
  primary: 'text-(--ui-button-primary-background)',
  success: 'text-ui-success',
  warning: 'text-ui-warning',
} as const;

export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  (
    {
      children,
      className,
      icon: IconComponent,
      label,
      loading = false,
      size = 16,
      strokeWidth = 2,
      style,
      tone = 'neutral',
      ...props
    },
    ref,
  ) => {
    const Component = loading ? Loader2 : IconComponent;
    const semanticProps =
      label == null
        ? { 'aria-hidden': true }
        : { 'aria-label': label, role: 'img' };

    return (
      <span
        className={cn(
          'inline-flex shrink-0 items-center justify-center align-middle',
          iconToneClassName[tone],
          className,
        )}
        data-slot="icon"
        ref={ref}
        style={{
          height: size,
          width: size,
          ...style,
        }}
        {...semanticProps}
        {...props}
      >
        {Component != null ? (
          <Component
            aria-hidden="true"
            className={cn(
              'size-full',
              loading && 'animate-spin motion-reduce:animate-none',
            )}
            strokeWidth={strokeWidth}
          />
        ) : (
          children
        )}
      </span>
    );
  },
);
Icon.displayName = 'Icon';
