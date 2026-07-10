import * as React from 'react';
import { cn } from '../../../internal/cn';
import { BreadcrumbNode } from './node';
import { OverflowMenu } from './overflow-menu';
import type { BreadcrumbProps } from './types';
import { resolveItems } from './utils';

export { BreadcrumbHomeIcon } from './home-icon';
export type { BreadcrumbItem, BreadcrumbProps } from './types';

export function Breadcrumb({
  className,
  compact = false,
  homeIcon,
  items,
  maxItems = 4,
  renderItem,
  separator = '/',
  ...props
}: BreadcrumbProps) {
  const resolvedItems = items.map((item, index) => {
    if (index === 0 && homeIcon !== undefined) {
      return { ...item, icon: homeIcon };
    }

    return item;
  });

  const { hiddenItems, visibleItems, insertIndex } = resolveItems(
    resolvedItems,
    maxItems,
  );
  const currentIndex = resolvedItems.length - 1;

  return (
    <nav
      aria-label="面包屑"
      className={cn(
        'flex min-h-[28px] min-w-0 items-center',
        compact && 'min-h-6',
        className,
      )}
      data-slot="breadcrumb"
      {...props}
    >
      <ol className="flex min-w-0 items-center gap-[6px]">
        {visibleItems.map((item, visibleIndex) => {
          const resolvedIndex = resolvedItems.indexOf(item);
          const isCurrent = resolvedIndex === currentIndex;

          return (
            <React.Fragment
              key={item.key ?? `${String(item.label)}-${visibleIndex}`}
            >
              {visibleIndex === insertIndex && hiddenItems.length > 0 && (
                <>
                  <li className="flex items-center">
                    <OverflowMenu compact={compact} items={hiddenItems} />
                  </li>
                  <li aria-hidden="true" className="text-ui-muted-foreground">
                    {separator}
                  </li>
                </>
              )}
              <li className="flex min-w-0 items-center">
                <BreadcrumbNode
                  compact={compact}
                  isCurrent={isCurrent}
                  item={item}
                  renderItem={renderItem}
                />
              </li>
              {!isCurrent && (
                <li aria-hidden="true" className="text-ui-muted-foreground">
                  {separator}
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
