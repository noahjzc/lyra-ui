import * as React from 'react';
import { cn } from '../../../internal/cn';

export const DropdownMenuShortcut = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'ml-auto shrink-0 text-xs text-ui-muted-foreground',
      className,
    )}
    {...props}
  />
));
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';
