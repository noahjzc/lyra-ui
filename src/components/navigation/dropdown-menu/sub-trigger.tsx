import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as React from 'react';
import { cn } from '../../../internal/cn';

export const DropdownMenuSubTrigger = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    icon?: React.ReactNode;
  }
>(({ children, className, icon, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center gap-2 rounded-[6px] px-3 py-1.5 text-[13px] leading-none outline-none transition-ui-state',
      'focus:bg-(--ui-button-ghost-background) focus:text-(--ui-button-primary-background)',
      'data-[disabled]:pointer-events-none data-[disabled]:text-ui-muted-foreground',
      'data-[state=open]:bg-(--ui-button-ghost-background) data-[state=open]:text-(--ui-button-primary-background)',
      className,
    )}
    {...props}
  >
    {icon != null && (
      <span
        aria-hidden="true"
        className="inline-flex size-4 shrink-0 text-ui-muted-foreground"
      >
        {icon}
      </span>
    )}
    <span className="min-w-0 flex-1 truncate">{children}</span>
    <svg
      aria-hidden="true"
      className="ml-auto size-3.5 shrink-0 text-ui-muted-foreground"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;
