import type * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type * as React from 'react';

export type TooltipContentSize = 'compact' | 'default';

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  showArrow?: boolean;
  size?: TooltipContentSize;
}

export type TooltipProviderProps = React.ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Provider
>;
