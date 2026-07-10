import type * as PopoverPrimitive from '@radix-ui/react-popover';
import type * as React from 'react';

export type PopoverContentSize = 'auto' | 'large' | 'medium' | 'small';

export type PopoverPlacement =
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight'
  | 'left'
  | 'leftBottom'
  | 'leftTop'
  | 'right'
  | 'rightBottom'
  | 'rightTop'
  | 'top'
  | 'topLeft'
  | 'topRight';

export interface PopoverArrowConfig {
  pointAtCenter?: boolean;
}

export type PopoverArrowConfigProp = boolean | PopoverArrowConfig;

export interface PopoverContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
    'align' | 'side'
  > {
  align?: React.ComponentPropsWithoutRef<
    typeof PopoverPrimitive.Content
  >['align'];
  arrow?: PopoverArrowConfigProp;
  placement?: PopoverPlacement;
  showArrow?: boolean;
  size?: PopoverContentSize;
  side?: React.ComponentPropsWithoutRef<
    typeof PopoverPrimitive.Content
  >['side'];
}

export type PopoverRegionProps = React.HTMLAttributes<HTMLDivElement>;
