import { Loader2 } from 'lucide-react';
import type * as React from 'react';
import { cn } from '../../../internal/cn';

export interface SpinProps extends React.HTMLAttributes<HTMLElement> {
  label?: React.ReactNode;
  overlay?: boolean;
  size?: 'sm' | 'md' | 'lg';
  spinning?: boolean;
}

const spinSizeClassName = {
  lg: 'size-8',
  md: 'size-6',
  sm: 'size-4',
} as const;

export function Spin({
  children,
  className,
  label,
  overlay = false,
  size = 'md',
  spinning = true,
  ...props
}: SpinProps) {
  const indicator = spinning ? (
    <output
      aria-live="polite"
      className={cn(
        'inline-flex items-center justify-center gap-2 text-ui-muted-foreground',
        children == null && className,
      )}
      data-slot="spin"
      {...(children == null ? props : undefined)}
    >
      <Loader2
        aria-hidden="true"
        className={cn(
          'animate-spin text-(--ui-button-primary-background) motion-reduce:animate-none',
          spinSizeClassName[size],
        )}
        data-slot="spin-indicator"
      />
      {label != null && (
        <span className="text-sm" data-slot="spin-label">
          {label}
        </span>
      )}
    </output>
  ) : null;

  if (children == null) return indicator;

  return (
    <div
      className={cn('relative min-w-0', className)}
      data-slot="spin-container"
      {...props}
    >
      <div aria-busy={spinning ? true : undefined} data-slot="spin-content">
        {children}
      </div>
      {overlay && indicator != null && (
        <div
          className="absolute inset-0 grid place-items-center bg-ui-background/70"
          data-slot="spin-mask"
        >
          {indicator}
        </div>
      )}
      {!overlay && indicator}
    </div>
  );
}
