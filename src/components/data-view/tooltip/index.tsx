/* eslint-disable react-refresh/only-export-components -- Tooltip 需要按 Radix slot 形式导出复合组件。 */
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import { useOverlayZIndex, Z_BASE } from '../../../overlay/z-stack';
import type { TooltipContentProps, TooltipProviderProps } from './types';
import { tooltipContentVariants } from './variants';

export function TooltipProvider({
  delayDuration = 500,
  skipDelayDuration = 200,
  ...props
}: TooltipProviderProps) {
  return (
    <TooltipPrimitive.Provider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      {...props}
    />
  );
}

const TooltipOpenContext = React.createContext<boolean | undefined>(undefined);

export function Tooltip({
  defaultOpen = false,
  onOpenChange,
  open,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>) {
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
    <TooltipOpenContext.Provider value={mergedOpen}>
      <TooltipPrimitive.Root
        open={mergedOpen}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </TooltipOpenContext.Provider>
  );
}
Tooltip.displayName = 'Tooltip';

export const TooltipTrigger = TooltipPrimitive.Trigger;
export const TooltipArrow = TooltipPrimitive.Arrow;
export type { TooltipContentProps, TooltipContentSize } from './types';

export const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(
  (
    {
      children,
      className,
      collisionPadding = 8,
      showArrow = true,
      sideOffset = 8,
      size = 'compact',
      style,
      ...props
    },
    ref,
  ) => {
    const open = React.useContext(TooltipOpenContext);
    const [zIndex, layerRef] = useOverlayZIndex(Z_BASE.tooltip, ref, open);

    return (
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          ref={layerRef}
          className={cn(tooltipContentVariants({ size }), className)}
          collisionPadding={collisionPadding}
          data-slot="tooltip-content"
          sideOffset={sideOffset}
          style={{ zIndex, ...style }}
          {...props}
        >
          {children}
          {showArrow && (
            <TooltipPrimitive.Arrow
              className="fill-(--ui-tooltip-background) stroke-(--ui-tooltip-border)"
              data-slot="tooltip-arrow"
              height={5}
              width={9}
            />
          )}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    );
  },
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
