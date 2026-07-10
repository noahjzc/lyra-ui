import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import type { DropdownMenuItemProps } from './types';

export const DropdownMenuItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(
  (
    { children, className, icon, shortcut, variant = 'default', ...props },
    ref,
  ) => (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        'relative flex min-h-8 cursor-default select-none items-center gap-2 rounded-[6px] px-3 py-2 leading-none outline-none transition-ui-state',
        'focus:bg-(--ui-button-ghost-background) focus:text-(--ui-button-primary-background)',
        'data-[disabled]:pointer-events-none data-[disabled]:text-ui-muted-foreground data-[disabled]:bg-(--ui-input-disabled-background)',
        variant === 'destructive' &&
          'text-(--ui-button-danger-foreground) focus:bg-(--ui-button-danger-background) focus:text-(--ui-button-danger-foreground)',
        className,
      )}
      data-variant={variant}
      {...props}
    >
      {icon != null && (
        <span
          aria-hidden="true"
          className="inline-flex size-4 shrink-0 items-center justify-center text-ui-muted-foreground"
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {shortcut != null && (
        <span className="ml-auto shrink-0 text-xs text-ui-muted-foreground">
          {shortcut}
        </span>
      )}
    </DropdownMenuPrimitive.Item>
  ),
);
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

export const DropdownMenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ children, className, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex min-h-8 cursor-default select-none items-center gap-2 rounded-[6px] px-3 py-2 pl-8 leading-none outline-none transition-ui-state',
      'focus:bg-(--ui-button-ghost-background) focus:text-(--ui-button-primary-background)',
      'data-[disabled]:pointer-events-none data-[disabled]:text-ui-muted-foreground',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2.5 flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <svg
          aria-hidden="true"
          className="size-3 text-(--ui-button-primary-background)"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    <span className="min-w-0 flex-1 truncate">{children}</span>
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

export interface DropdownMenuRadioItemProps
  extends React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.RadioItem
  > {
  /** 左侧图标（16px），渲染于选中指示器与文案之间；匹配 DropdownMenuItem 的 icon 样式 */
  icon?: React.ReactNode;
}

export const DropdownMenuRadioItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.RadioItem>,
  DropdownMenuRadioItemProps
>(({ children, className, icon, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex min-h-8 cursor-default select-none items-center gap-2 rounded-[6px] px-3 py-2 pl-8 leading-none outline-none transition-ui-state',
      'focus:bg-(--ui-button-ghost-background) focus:text-(--ui-button-primary-background)',
      'data-[disabled]:pointer-events-none data-[disabled]:text-ui-muted-foreground',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2.5 flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <svg
          aria-hidden="true"
          className="size-3 text-(--ui-button-primary-background)"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <circle cx={8} cy={8} r={3} />
        </svg>
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {icon != null && (
      <span
        aria-hidden="true"
        className="inline-flex size-4 shrink-0 items-center justify-center text-ui-muted-foreground"
      >
        {icon}
      </span>
    )}
    <span className="min-w-0 flex-1 truncate">{children}</span>
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
