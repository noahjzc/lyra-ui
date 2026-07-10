import * as TabsPrimitive from '@radix-ui/react-tabs';
import { type ComponentRef, forwardRef } from 'react';
import { cn } from '../../../internal/cn';
import type { TabsContentProps } from './types';
import { tabsContentClassName } from './variants';

export const TabsContent = forwardRef<
  ComponentRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    className={cn(tabsContentClassName, className)}
    data-slot="tabs-content"
    ref={ref}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
