import type * as TabsPrimitive from '@radix-ui/react-tabs';
import type * as React from 'react';

export type TabsVariant = 'line' | 'segment' | 'card' | 'cache';
export type TabsSize = 'small' | 'middle' | 'large';

export interface TabsContextValue {
  size: TabsSize;
  variant: TabsVariant;
}

export interface TabsProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  size?: TabsSize;
  variant?: TabsVariant;
}

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  variant?: TabsVariant;
}

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  size?: TabsSize;
  variant?: TabsVariant;
}

export type TabsContentProps = React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Content
>;
