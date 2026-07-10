import * as React from 'react';
import { cn } from '../../../internal/cn';
import {
  emptyDefaultDescription,
  emptyDefaultTitle,
  emptyIcon,
} from './constants';
import type { EmptyProps } from './types';
import { emptyVariants, emptyVisualVariants } from './variants';

export type { EmptyProps, EmptyType } from './types';

export const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  (
    {
      action,
      className,
      compact = false,
      description,
      icon,
      role,
      title,
      type = 'no-data',
      ...props
    },
    ref,
  ) => {
    const Icon = emptyIcon[type];
    const resolvedRole = role ?? (type === 'error-empty' ? 'alert' : 'status');
    const ariaLive =
      props['aria-live'] ?? (type === 'error-empty' ? 'assertive' : 'polite');

    return (
      <div
        aria-live={ariaLive}
        className={cn(emptyVariants({ compact }), className)}
        data-slot="empty"
        ref={ref}
        role={resolvedRole}
        {...props}
      >
        <div
          aria-hidden="true"
          className={cn(emptyVisualVariants({ compact, type }))}
          data-slot="empty-visual"
        >
          {icon ?? <Icon className={compact ? 'size-5' : 'size-7'} />}
        </div>
        <div className="grid max-w-[360px] gap-1">
          <div
            className="text-sm font-bold leading-5 text-ui-foreground"
            data-slot="empty-title"
          >
            {title ?? emptyDefaultTitle[type]}
          </div>
          {description !== null && (
            <div
              className="text-xs leading-5 text-ui-muted-foreground"
              data-slot="empty-description"
            >
              {description ?? emptyDefaultDescription[type]}
            </div>
          )}
        </div>
        {action != null && (
          <div
            className="mt-1 flex flex-wrap justify-center gap-2"
            data-slot="empty-action"
          >
            {action}
          </div>
        )}
      </div>
    );
  },
);
Empty.displayName = 'Empty';
