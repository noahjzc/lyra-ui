import type * as React from 'react';
import { cn } from '../../../internal/cn';

/**
 * 默认首页图标，匹配设计稿：18px 主题色方块，内含"首"字。
 */
export function BreadcrumbHomeIcon({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border border-(--ui-button-ghost-border) bg-(--ui-button-ghost-background) text-[11px] font-extrabold text-(--ui-button-primary-background)',
        className,
      )}
      {...props}
    >
      首
    </span>
  );
}
