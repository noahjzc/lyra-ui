import {
  AlertCircle,
  CheckCircle2,
  FileQuestion,
  ShieldAlert,
  TriangleAlert,
} from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../internal/cn';

export type ResultStatus =
  | 'success'
  | 'error'
  | 'warning'
  | '403'
  | '404'
  | 'empty';

export interface ResultProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  actions?: React.ReactNode;
  compact?: boolean;
  density?: 'compact' | 'default' | 'page';
  description?: React.ReactNode;
  extra?: React.ReactNode;
  icon?: React.ReactNode;
  status?: ResultStatus;
  title: React.ReactNode;
}

const resultIcon = {
  '403': ShieldAlert,
  '404': FileQuestion,
  empty: FileQuestion,
  error: AlertCircle,
  success: CheckCircle2,
  warning: TriangleAlert,
} as const;

const resultColorClassName = {
  '403': 'border-ui-warning/35 bg-ui-warning/10 text-ui-warning',
  '404': 'border-ui-border bg-ui-muted text-ui-muted-foreground',
  empty: 'border-ui-border bg-ui-muted text-ui-muted-foreground',
  error: 'border-ui-destructive/25 bg-ui-destructive/10 text-ui-destructive',
  success: 'border-ui-success/30 bg-ui-success/10 text-ui-success',
  warning: 'border-ui-warning/35 bg-ui-warning/10 text-ui-warning',
} as const;

const resultDensityClassName = {
  compact: 'gap-3 py-6',
  default: 'gap-4 py-14',
  page: 'min-h-[320px] gap-5 py-16',
} as const;

const resultIconSizeClassName = {
  compact: 'size-12',
  default: 'size-16',
  page: 'size-16',
} as const;

const resultSvgSizeClassName = {
  compact: 'size-6',
  default: 'size-8',
  page: 'size-8',
} as const;

const resultTitleClassName = {
  compact: 'text-base',
  default: 'text-xl',
  page: 'text-xl',
} as const;

const resultRole = 'region';

export const Result = React.forwardRef<HTMLElement, ResultProps>(
  (
    {
      actions,
      className,
      compact = false,
      density,
      description,
      extra,
      icon,
      status = 'success',
      title,
      ...props
    },
    ref,
  ) => {
    const Icon = resultIcon[status];
    const resolvedDensity = density ?? (compact ? 'compact' : 'default');
    const titleId = React.useId();

    return (
      <section
        aria-labelledby={titleId}
        className={cn(
          'flex min-w-0 flex-col items-center justify-center text-center',
          resultDensityClassName[resolvedDensity],
          className,
        )}
        data-status={status}
        data-slot="result"
        ref={ref}
        role={resultRole}
        {...props}
      >
        <div
          aria-hidden="true"
          className={cn(
            'inline-flex items-center justify-center rounded-full border',
            resultIconSizeClassName[resolvedDensity],
            resultColorClassName[status],
          )}
          data-slot="result-icon"
        >
          {icon ?? <Icon className={resultSvgSizeClassName[resolvedDensity]} />}
        </div>
        <div className="grid max-w-[480px] gap-2">
          <h2
            className={cn(
              'm-0 font-extrabold text-ui-foreground',
              resultTitleClassName[resolvedDensity],
            )}
            data-slot="result-title"
            id={titleId}
          >
            {title}
          </h2>
          {description != null && (
            <div
              className="text-sm leading-5 text-ui-muted-foreground"
              data-slot="result-description"
            >
              {description}
            </div>
          )}
        </div>
        {actions != null && (
          <div
            className="flex flex-wrap items-center justify-center gap-2"
            data-slot="result-actions"
          >
            {actions}
          </div>
        )}
        {extra != null && (
          <div className="w-full max-w-[560px]" data-slot="result-extra">
            {extra}
          </div>
        )}
      </section>
    );
  },
);
Result.displayName = 'Result';
