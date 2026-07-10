import { Check, X } from 'lucide-react';
import type * as React from 'react';
import { cn } from '../../../internal/cn';

export type ProgressStatus = 'active' | 'success' | 'warning' | 'error';
export type ProgressVariant = 'line' | 'circle' | 'steps';

export interface ProgressProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  label?: React.ReactNode;
  max?: number;
  showLabel?: boolean;
  size?: 'small' | 'middle' | 'large';
  status?: ProgressStatus;
  steps?: number;
  value: number;
  variant?: ProgressVariant;
}

const progressBarClassName = {
  active: 'bg-(--ui-button-primary-background)',
  error: 'bg-ui-destructive',
  success: 'bg-ui-success',
  warning: 'bg-ui-warning',
} as const;

const progressColorValue = {
  active: 'var(--ui-button-primary-background)',
  error: 'var(--ui-destructive)',
  success: 'var(--ui-success)',
  warning: 'var(--ui-warning)',
} as const;

const progressStatusClassName = {
  active: 'text-ui-muted-foreground',
  error: 'text-ui-destructive',
  success: 'text-ui-success',
  warning: 'text-ui-warning',
} as const;

const progressStatusText = {
  active: undefined,
  error: '失败',
  success: '完成',
  warning: '注意',
} as const;

const progressSizeClassName = {
  large: 'h-2',
  middle: 'h-1.5',
  small: 'h-1',
} as const;

function clampProgress(value: number, max: number) {
  if (!Number.isFinite(value) || max <= 0) {
    return 0;
  }

  return Math.min(Math.max(value, 0), max);
}

function getPercent(value: number, max: number) {
  if (max <= 0) {
    return 0;
  }

  return Math.round((clampProgress(value, max) / max) * 100);
}

function normalizeMax(max: number) {
  return Number.isFinite(max) && max > 0 ? max : 0;
}

function normalizeSteps(steps: number) {
  return Number.isFinite(steps) ? Math.max(1, Math.floor(steps)) : 1;
}

export function Progress({
  className,
  label,
  max = 100,
  showLabel = true,
  size = 'middle',
  status = 'active',
  steps = 5,
  value,
  variant = 'line',
  ...props
}: ProgressProps) {
  const safeMax = normalizeMax(max);
  const clampedValue = clampProgress(value, safeMax);
  const percent = getPercent(value, safeMax);
  const labelNode = label ?? `${percent}%`;
  const statusText = progressStatusText[status] ?? `${percent}%`;
  const ariaLabel =
    props['aria-label'] ??
    (typeof labelNode === 'string' ? labelNode : `${percent}%`);
  const indicatorOffset = percent === 100 ? 0 : 100 - percent;
  const indicatorTransform =
    indicatorOffset === 0
      ? 'translateX(0%)'
      : `translateX(-${indicatorOffset}%)`;
  const circleRadius = 28;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const circleOffset = circleCircumference * (1 - percent / 100);

  if (variant === 'circle') {
    return (
      <div
        aria-label={ariaLabel}
        aria-valuemax={safeMax}
        aria-valuemin={0}
        aria-valuenow={clampedValue}
        className={cn(
          'inline-grid min-w-0 place-items-center gap-2',
          className,
        )}
        data-slot="progress"
        role="progressbar"
        {...props}
      >
        <div className="relative grid size-16 place-items-center text-sm font-extrabold">
          <svg
            aria-hidden="true"
            className="-rotate-90 size-16"
            viewBox="0 0 64 64"
          >
            <circle
              className="stroke-ui-muted"
              cx="32"
              cy="32"
              data-slot="progress-track"
              fill="none"
              r={circleRadius}
              strokeWidth="8"
            />
            <circle
              cx="32"
              cy="32"
              data-slot="progress-indicator"
              fill="none"
              r={circleRadius}
              stroke={progressColorValue[status]}
              strokeDasharray={circleCircumference}
              strokeDashoffset={circleOffset}
              strokeLinecap="round"
              strokeWidth="8"
            />
          </svg>
          <span
            className="absolute inset-2 grid place-items-center rounded-full bg-ui-background"
            data-slot="progress-status"
          >
            {statusText}
          </span>
        </div>
        {showLabel && (
          <span
            className="max-w-28 truncate text-center text-xs font-semibold text-ui-muted-foreground"
            data-slot="progress-label"
          >
            {labelNode}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'steps') {
    const safeSteps = normalizeSteps(steps);
    const activeSteps = Math.min(
      safeSteps,
      Math.round((percent / 100) * safeSteps),
    );

    return (
      <div
        aria-label={ariaLabel}
        aria-valuemax={safeMax}
        aria-valuemin={0}
        aria-valuenow={clampedValue}
        className={cn('flex min-w-0 items-center gap-2', className)}
        data-slot="progress"
        role="progressbar"
        {...props}
      >
        <div className="flex min-w-0 flex-1 gap-1" data-slot="progress-track">
          {Array.from({ length: safeSteps }, (_, step) => step + 1).map(
            step => (
              <span
                className={cn(
                  'relative h-1.5 min-w-4 flex-1 overflow-hidden rounded-full bg-ui-muted',
                )}
                data-active={step <= activeSteps ? 'true' : undefined}
                data-slot="progress-step"
                key={step}
              >
                {step <= activeSteps && (
                  <span
                    className={cn(
                      'absolute inset-0',
                      progressBarClassName[status],
                    )}
                    data-slot="progress-indicator"
                  />
                )}
              </span>
            ),
          )}
        </div>
        {showLabel && (
          <span
            className="shrink-0 text-xs font-bold text-ui-muted-foreground"
            data-slot="progress-label"
          >
            {labelNode}
          </span>
        )}
        {showLabel && (
          <span
            className={cn(
              'shrink-0 text-xs font-bold tabular-nums',
              progressStatusClassName[status],
            )}
            data-slot="progress-status"
          >
            {statusText}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      aria-label={ariaLabel}
      aria-valuemax={safeMax}
      aria-valuemin={0}
      aria-valuenow={clampedValue}
      className={cn('flex min-w-0 items-center gap-2', className)}
      data-slot="progress"
      role="progressbar"
      {...props}
    >
      <div
        className={cn(
          'min-w-0 flex-1 overflow-hidden rounded-full bg-ui-muted',
          progressSizeClassName[size],
        )}
        data-slot="progress-track"
      >
        <div
          className={cn(
            'h-full origin-left rounded-full transition-ui-transform',
            progressBarClassName[status],
          )}
          data-slot="progress-indicator"
          style={{ transform: indicatorTransform }}
        />
      </div>
      {showLabel && (
        <span
          className="min-w-0 truncate text-xs font-semibold text-ui-muted-foreground"
          data-slot="progress-label"
        >
          {labelNode}
        </span>
      )}
      {showLabel && (
        <span
          className={cn(
            'inline-flex min-w-10 shrink-0 items-center justify-end gap-1 text-xs font-bold tabular-nums',
            progressStatusClassName[status],
          )}
          data-slot="progress-status"
        >
          {status === 'success' && (
            <Check aria-hidden="true" className="size-3" />
          )}
          {status === 'error' && <X aria-hidden="true" className="size-3" />}
          {statusText}
        </span>
      )}
    </div>
  );
}
