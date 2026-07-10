import type * as React from 'react';
import { cn } from '../../../internal/cn';

export interface PaginationPageButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  iconOnly?: boolean;
  size?: 'middle' | 'small';
}

export function PaginationPageButton({
  active = false,
  className,
  iconOnly = false,
  size = 'middle',
  type = 'button',
  ...props
}: PaginationPageButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-md border px-2 text-[13px] leading-none outline-none transition-ui-state focus-visible:border-(--ui-button-focus-border) focus-visible:ring-2 focus-visible:ring-(--ui-button-focus-ring) disabled:cursor-not-allowed disabled:border-(--ui-input-disabled-border) disabled:bg-(--ui-input-disabled-background) disabled:text-(--ui-input-disabled-foreground)',
        size === 'middle' ? 'h-8 min-w-8' : 'h-7 min-w-7',
        iconOnly && (size === 'middle' ? 'w-8 px-0' : 'w-7 px-0'),
        active
          ? 'border-(--ui-button-ghost-border) bg-(--ui-button-ghost-background) font-bold text-(--ui-button-ghost-foreground)'
          : 'border-(--ui-button-default-border) bg-(--ui-button-default-background) font-medium text-ui-muted-foreground hover:border-(--ui-button-default-hover-border) hover:bg-(--ui-button-default-hover-background) hover:text-(--ui-button-default-hover-foreground)',
        className,
      )}
      data-slot="pagination-page-item"
      type={type}
      {...props}
    />
  );
}
