import * as React from 'react';
import { cn } from '../../../internal/cn';
import type { FormGridProps, FormSectionProps } from './types';
import { gridColumnClassName } from './variants';

export const FormSection = React.forwardRef<HTMLElement, FormSectionProps>(
  ({ actions, children, className, description, title, ...props }, ref) => (
    <section
      className={cn(
        'grid min-w-0 gap-3 rounded-lg border border-ui-border bg-ui-background p-3',
        className,
      )}
      data-slot="form-section"
      ref={ref}
      {...props}
    >
      {(title != null || description != null || actions != null) && (
        <div
          className="flex min-w-0 items-start justify-between gap-3"
          data-slot="form-section-header"
        >
          <div className="grid min-w-0 gap-1">
            {title != null && (
              <h3 className="m-0 text-sm font-extrabold leading-5">{title}</h3>
            )}
            {description != null && (
              <p className="m-0 text-ui-muted-foreground text-xs leading-4">
                {description}
              </p>
            )}
          </div>
          {actions != null && (
            <div className="shrink-0" data-slot="form-section-actions">
              {actions}
            </div>
          )}
        </div>
      )}
      {children}
    </section>
  ),
);

FormSection.displayName = 'FormSection';

export const FormGrid = React.forwardRef<HTMLDivElement, FormGridProps>(
  ({ children, className, columns = 2, ...props }, ref) => (
    <div
      className={cn(
        'grid min-w-0 gap-x-3 gap-y-3',
        gridColumnClassName[columns],
        className,
      )}
      data-columns={columns}
      data-slot="form-grid"
      ref={ref}
      {...props}
    >
      {children}
    </div>
  ),
);

FormGrid.displayName = 'FormGrid';
