import * as React from 'react';
import { cn } from '../../../internal/cn';
import type { FormReadonlyValueProps } from './types';

export const FormReadonlyValue = React.forwardRef<
  HTMLDivElement,
  FormReadonlyValueProps
>(({ className, placeholder = '-', value, ...props }, ref) => (
  <div
    className={cn(
      'flex min-h-8 min-w-0 items-center rounded-md border border-dashed border-(--ui-input-border) bg-(--ui-input-readonly-background) px-2.5 text-sm text-ui-foreground',
      value == null && 'text-ui-muted-foreground',
      className,
    )}
    data-slot="form-readonly-value"
    ref={ref}
    {...props}
  >
    <span className="truncate">{value ?? placeholder}</span>
  </div>
));

FormReadonlyValue.displayName = 'FormReadonlyValue';
