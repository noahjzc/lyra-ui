import { cva, type VariantProps } from 'class-variance-authority';
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
} from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../internal/cn';

const alertVariants = cva(
  'grid min-w-0 gap-3 rounded-md border px-4 py-3 text-sm',
  {
    variants: {
      variant: {
        error:
          'border-ui-destructive/20 bg-ui-destructive/10 text-ui-destructive',
        info: 'border-ui-processing/20 bg-ui-processing/10 text-ui-processing',
        success: 'border-ui-success/20 bg-ui-success/10 text-ui-success',
        warning: 'border-ui-warning/20 bg-ui-warning/10 text-ui-warning',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

const alertIcon = {
  error: AlertCircle,
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
} as const;

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    Pick<VariantProps<typeof alertVariants>, 'variant'> {
  action?: React.ReactNode;
  closeLabel?: string;
  closable?: boolean;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
  title?: React.ReactNode;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      action,
      className,
      closeLabel = '关闭提示',
      closable = false,
      description,
      icon,
      onClose,
      role,
      title,
      variant = 'info',
      ...props
    },
    ref,
  ) => {
    const Icon = alertIcon[variant ?? 'info'];

    return (
      <div
        className={cn(alertVariants({ variant }), className)}
        data-slot="alert"
        ref={ref}
        role={
          role ??
          (variant === 'error' || variant === 'warning' ? 'alert' : 'status')
        }
        {...props}
      >
        <div className="flex min-w-0 items-start gap-2">
          <span
            aria-hidden="true"
            className="mt-0.5 inline-flex shrink-0"
            data-slot="alert-icon"
          >
            {icon ?? <Icon className="size-4" />}
          </span>
          <div className="grid min-w-0 flex-1 gap-1 text-ui-foreground">
            {title != null && (
              <div className="font-extrabold" data-slot="alert-title">
                {title}
              </div>
            )}
            {description != null && (
              <div
                className="break-words text-ui-muted-foreground"
                data-slot="alert-description"
              >
                {description}
              </div>
            )}
          </div>
          {closable && (
            <button
              aria-label={closeLabel}
              className="inline-flex size-6 shrink-0 items-center justify-center rounded text-ui-muted-foreground transition-ui-state hover:bg-ui-muted hover:text-ui-foreground"
              data-slot="alert-close"
              onClick={onClose}
              type="button"
            >
              <X aria-hidden="true" className="size-3.5" />
            </button>
          )}
        </div>
        {action != null && (
          <div className="pl-6" data-slot="alert-action">
            {action}
          </div>
        )}
      </div>
    );
  },
);
Alert.displayName = 'Alert';
