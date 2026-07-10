import { cva } from 'class-variance-authority';
import type { CSSProperties } from 'react';
import type { PopoverArrowConfigProp, PopoverPlacement } from './types';

export const popoverLayerShadowStyle = {
  filter:
    'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1)) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.08))',
} satisfies CSSProperties;

export const popoverContentVariants = cva(
  'flex max-h-[420px] flex-col rounded-lg border border-ui-border bg-ui-background text-ui-foreground outline-none data-[state=closed]:animate-ui-layer-out data-[state=open]:animate-ui-layer-in',
  {
    variants: {
      size: {
        auto: 'min-w-64 max-w-[420px]',
        large: 'w-[420px] max-w-[calc(100vw-32px)]',
        medium: 'w-72 max-w-[calc(100vw-32px)]',
        small: 'w-64 max-w-[calc(100vw-32px)]',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  },
);

export const popoverHeaderClassName =
  'flex min-h-10 shrink-0 items-center justify-between gap-3 border-ui-border border-b px-4 py-2 text-sm font-semibold';

export const popoverBodyClassName = 'min-h-0 flex-1 overflow-y-auto p-4';

export const popoverFooterClassName =
  'flex min-h-10 shrink-0 items-center justify-end gap-2 border-ui-border border-t px-4 py-2';

export const popoverArrowClassName = 'block overflow-visible';

export const popoverArrowFillPathClassName = 'fill-(--ui-background)';

export const popoverArrowStrokePathClassName = 'stroke-(--ui-border)';

export const popoverArrowFillPath = 'M0 -1 H16 V0 L8 8 L0 0 Z';

export const popoverArrowStrokePath = 'M0 0 L8 8 L16 0';
export const popoverArrowSize = {
  height: 8,
  width: 16,
} as const;

export const popoverPlacementVariants = {
  bottom: { align: 'center', side: 'bottom' },
  bottomLeft: { align: 'start', side: 'bottom' },
  bottomRight: { align: 'end', side: 'bottom' },
  left: { align: 'center', side: 'left' },
  leftBottom: { align: 'end', side: 'left' },
  leftTop: { align: 'start', side: 'left' },
  right: { align: 'center', side: 'right' },
  rightBottom: { align: 'end', side: 'right' },
  rightTop: { align: 'start', side: 'right' },
  top: { align: 'center', side: 'top' },
  topLeft: { align: 'start', side: 'top' },
  topRight: { align: 'end', side: 'top' },
} as const satisfies Record<
  PopoverPlacement,
  {
    align: 'center' | 'end' | 'start';
    side: 'bottom' | 'left' | 'right' | 'top';
  }
>;

export function getPopoverPlacementProps(
  placement: PopoverPlacement = 'bottom',
) {
  return popoverPlacementVariants[placement];
}

export function shouldRenderPopoverArrow({
  arrow,
  showArrow,
}: {
  arrow?: PopoverArrowConfigProp;
  showArrow?: boolean;
}) {
  return arrow !== false && showArrow !== false;
}

export function shouldPointPopoverArrowAtCenter(
  arrow?: PopoverArrowConfigProp,
) {
  return typeof arrow === 'object' && arrow.pointAtCenter === true;
}
