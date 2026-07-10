import * as TabsPrimitive from '@radix-ui/react-tabs';
import { type ComponentRef, forwardRef } from 'react';
import { cn } from '../../../internal/cn';
import { useTabsContext } from './context';
import type { TabsListProps } from './types';
import { tabsListClassName } from './variants';

export const TabsList = forwardRef<
  ComponentRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, ...props }, ref) => {
  const context = useTabsContext();
  const resolvedVariant = variant ?? context.variant;

  return (
    <TabsPrimitive.List
      className={cn(
        'flex min-w-0 items-center motion-reduce:transition-none',
        tabsListClassName[resolvedVariant],
        className,
      )}
      data-slot="tabs-list"
      data-variant={resolvedVariant}
      ref={ref}
      {...props}
    />
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;
