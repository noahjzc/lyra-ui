import * as TabsPrimitive from '@radix-ui/react-tabs';
import { type ComponentRef, forwardRef } from 'react';
import { cn } from '../../../internal/cn';
import { TabsContext } from './context';
import { TabsContent } from './tabs-content';
import { TabsList } from './tabs-list';
import { TabsTrigger } from './tabs-trigger';
import type { TabsProps } from './types';

export type {
  TabsContentProps,
  TabsListProps,
  TabsProps,
  TabsSize,
  TabsTriggerProps,
  TabsVariant,
} from './types';
export {
  tabsContentClassName,
  tabsListClassName,
  tabsTriggerClassName,
  tabsTriggerSizeClassName,
} from './variants';
export { TabsContent, TabsList, TabsTrigger };

export const Tabs = forwardRef<
  ComponentRef<typeof TabsPrimitive.Root>,
  TabsProps
>(
  (
    {
      className,
      size = 'middle',
      variant = 'line',
      orientation = 'horizontal',
      ...props
    },
    ref,
  ) => (
    <TabsContext.Provider value={{ size, variant }}>
      <TabsPrimitive.Root
        className={cn('grid min-w-0', className)}
        data-slot="tabs"
        data-variant={variant}
        orientation={orientation}
        ref={ref}
        {...props}
      />
    </TabsContext.Provider>
  ),
);
Tabs.displayName = TabsPrimitive.Root.displayName;
