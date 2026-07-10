/* eslint-disable react-refresh/only-export-components -- Popover 需要按 Radix slot 形式导出复合组件。 */
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import { useOverlayZIndex, Z_BASE } from '../../../overlay/z-stack';
import type { PopoverContentProps, PopoverRegionProps } from './types';
import {
  getPopoverPlacementProps,
  popoverArrowClassName,
  popoverArrowFillPath,
  popoverArrowFillPathClassName,
  popoverArrowSize,
  popoverArrowStrokePath,
  popoverArrowStrokePathClassName,
  popoverBodyClassName,
  popoverContentVariants,
  popoverFooterClassName,
  popoverHeaderClassName,
  popoverLayerShadowStyle,
  shouldPointPopoverArrowAtCenter,
  shouldRenderPopoverArrow,
} from './variants';

const PopoverOpenContext = React.createContext<boolean | undefined>(undefined);

export function Popover({
  defaultOpen = false,
  onOpenChange,
  open,
  ...props
}: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = open != null;
  const mergedOpen = isControlled ? open : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  return (
    <PopoverOpenContext.Provider value={mergedOpen}>
      <PopoverPrimitive.Root
        open={mergedOpen}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </PopoverOpenContext.Provider>
  );
}
Popover.displayName = 'Popover';

export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverClose = PopoverPrimitive.Close;
export const PopoverArrow = PopoverPrimitive.Arrow;
export type {
  PopoverArrowConfig,
  PopoverArrowConfigProp,
  PopoverContentProps,
  PopoverContentSize,
  PopoverPlacement,
  PopoverRegionProps,
} from './types';

export const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    {
      arrow,
      children,
      className,
      align,
      collisionPadding = 8,
      placement = 'bottom',
      showArrow = true,
      side,
      sideOffset = 8,
      size = 'medium',
      style,
      ...props
    },
    ref,
  ) => {
    const open = React.useContext(PopoverOpenContext);
    const [zIndex, layerRef] = useOverlayZIndex(Z_BASE.popover, ref, open);
    const placementProps = getPopoverPlacementProps(placement);
    const mergedAlign = align ?? placementProps.align;
    const mergedSide = side ?? placementProps.side;
    const arrowVisible = shouldRenderPopoverArrow({ arrow, showArrow });
    const arrowPointAtCenter = shouldPointPopoverArrowAtCenter(arrow);

    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={layerRef}
          align={mergedAlign}
          className={cn(popoverContentVariants({ size }), className)}
          collisionPadding={collisionPadding}
          data-slot="popover-content"
          side={mergedSide}
          sideOffset={sideOffset}
          style={{ ...popoverLayerShadowStyle, zIndex, ...style }}
          {...props}
        >
          {children}
          {arrowVisible && (
            <PopoverPrimitive.Arrow
              asChild
              className={popoverArrowClassName}
              data-slot="popover-arrow"
              data-point-at-center={arrowPointAtCenter ? 'true' : undefined}
              height={popoverArrowSize.height}
              width={popoverArrowSize.width}
            >
              <svg
                aria-hidden="true"
                viewBox={`0 0 ${popoverArrowSize.width} ${popoverArrowSize.height}`}
              >
                <path
                  className={popoverArrowFillPathClassName}
                  d={popoverArrowFillPath}
                  data-slot="popover-arrow-fill"
                />
                <path
                  className={popoverArrowStrokePathClassName}
                  d={popoverArrowStrokePath}
                  data-slot="popover-arrow-stroke"
                  fill="none"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </PopoverPrimitive.Arrow>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    );
  },
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export const PopoverHeader = React.forwardRef<
  HTMLDivElement,
  PopoverRegionProps
>(({ className, ...props }, ref) => (
  <div
    className={cn(popoverHeaderClassName, className)}
    data-slot="popover-header"
    ref={ref}
    {...props}
  />
));
PopoverHeader.displayName = 'PopoverHeader';

export const PopoverBody = React.forwardRef<HTMLDivElement, PopoverRegionProps>(
  ({ className, ...props }, ref) => (
    <div
      className={cn(popoverBodyClassName, className)}
      data-slot="popover-body"
      ref={ref}
      {...props}
    />
  ),
);
PopoverBody.displayName = 'PopoverBody';

export const PopoverFooter = React.forwardRef<
  HTMLDivElement,
  PopoverRegionProps
>(({ className, ...props }, ref) => (
  <div
    className={cn(popoverFooterClassName, className)}
    data-slot="popover-footer"
    ref={ref}
    {...props}
  />
));
PopoverFooter.displayName = 'PopoverFooter';
