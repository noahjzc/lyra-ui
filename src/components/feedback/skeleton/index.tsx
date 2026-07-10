import type * as React from 'react';
import { cn } from '../../../internal/cn';

export interface SkeletonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  active?: boolean;
  avatar?: boolean;
  loading?: boolean;
  preset?: 'text' | 'list' | 'card' | 'table' | 'detail';
  rows?: number;
  width?: number | string;
}

function resolveWidth(width: SkeletonProps['width']) {
  if (typeof width === 'number') return `${width}px`;

  return width;
}

function SkeletonBlock({
  active,
  className,
  width,
}: {
  active: boolean;
  className?: string;
  width?: SkeletonProps['width'];
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'block rounded bg-ui-muted',
        active ? 'animate-pulse motion-reduce:animate-none' : 'animate-none',
        className,
      )}
      data-slot="skeleton-block"
      style={{ width: resolveWidth(width) }}
    />
  );
}

export function Skeleton({
  active = true,
  avatar = false,
  children,
  className,
  loading = true,
  preset = 'text',
  rows = 3,
  width,
  ...props
}: SkeletonProps) {
  if (!loading) return <>{children}</>;

  return (
    <div
      className={cn('min-w-0', className)}
      data-slot="skeleton"
      {...props}
      aria-hidden="true"
    >
      {preset === 'table' ? (
        <div className="grid gap-2">
          {Array.from({ length: rows }, (_, row) => row + 1).map(row => (
            <div className="grid grid-cols-4 gap-2" key={row}>
              <SkeletonBlock active={active} className="h-4" />
              <SkeletonBlock active={active} className="h-4" />
              <SkeletonBlock active={active} className="h-4" />
              <SkeletonBlock active={active} className="h-4" />
            </div>
          ))}
        </div>
      ) : preset === 'card' ? (
        <div className="grid gap-3 rounded-md border border-ui-border p-4">
          <SkeletonBlock active={active} className="h-28" />
          <SkeletonBlock active={active} className="h-4" width="45%" />
          <SkeletonBlock active={active} className="h-3" />
          <SkeletonBlock active={active} className="h-3" width="70%" />
        </div>
      ) : preset === 'detail' ? (
        <div className="grid gap-3">
          {Array.from({ length: rows }, (_, row) => row + 1).map(row => (
            <div className="grid grid-cols-[120px_1fr] gap-3" key={row}>
              <SkeletonBlock active={active} className="h-4" />
              <SkeletonBlock active={active} className="h-8" />
            </div>
          ))}
        </div>
      ) : preset === 'list' ? (
        <div className="grid gap-3">
          {Array.from({ length: rows }, (_, row) => row + 1).map(row => (
            <div className="grid grid-cols-[32px_1fr] gap-3" key={row}>
              <SkeletonBlock active={active} className="size-8 rounded-full" />
              <SkeletonBlock
                active={active}
                className="h-4 self-center"
                width={row === rows ? '72%' : undefined}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-w-0 gap-3">
          {avatar && (
            <SkeletonBlock
              active={active}
              className="size-8 shrink-0 rounded-full"
            />
          )}
          <div className="grid min-w-0 flex-1 gap-2">
            <SkeletonBlock
              active={active}
              className="h-4"
              width={width ?? '40%'}
            />
            {Array.from({ length: rows }, (_, row) => row + 1).map(row => (
              <SkeletonBlock
                active={active}
                className="h-3"
                key={row}
                width={row === rows ? '70%' : undefined}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
