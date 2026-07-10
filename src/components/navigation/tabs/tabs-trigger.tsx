import * as TabsPrimitive from '@radix-ui/react-tabs';
import { type ComponentRef, forwardRef } from 'react';
import { cn } from '../../../internal/cn';
import { useTabsContext } from './context';
import type { TabsTriggerProps } from './types';
import { tabsTriggerClassName, tabsTriggerSizeClassName } from './variants';

export const TabsTrigger = forwardRef<
  ComponentRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, size, variant, ...props }, ref) => {
  const context = useTabsContext();
  const resolvedVariant = variant ?? context.variant;
  const resolvedSize = size ?? context.size;

  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex min-w-0 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap outline-none transition-ui-state focus-visible:ring-2 focus-visible:ring-(--ui-button-focus-ring) disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none',
        tabsTriggerSizeClassName[resolvedSize],
        tabsTriggerClassName[resolvedVariant],
        className,
      )}
      data-slot="tabs-trigger"
      data-variant={resolvedVariant}
      ref={ref}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
