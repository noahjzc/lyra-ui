import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import { useOverlayZIndex, Z_BASE } from '../../../overlay/z-stack';
import { DropdownMenuOpenContext } from './context';

export const DropdownMenuContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, style, ...props }, ref) => {
  const open = React.useContext(DropdownMenuOpenContext);
  const [zIndex, layerRef] = useOverlayZIndex(Z_BASE.popover, ref, open);

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={layerRef}
        className={cn(
          'grid min-w-(--radix-dropdown-menu-trigger-width) gap-1 overflow-hidden rounded-[6px] border border-ui-border bg-ui-background p-1.5 text-ui-foreground shadow-ui-elevation-2',
          'data-[state=closed]:animate-ui-layer-out data-[state=open]:animate-ui-layer-in',
          className,
        )}
        sideOffset={sideOffset}
        style={{ zIndex, ...style }}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
});
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

export const DropdownMenuSubContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, style, ...props }, ref) => {
  const [zIndex, layerRef] = useOverlayZIndex(Z_BASE.popover, ref);

  return (
    <DropdownMenuPrimitive.SubContent
      ref={layerRef}
      className={cn(
        'grid min-w-40 gap-1 overflow-hidden rounded-[6px] border border-ui-border bg-ui-background p-1.5 text-ui-foreground shadow-ui-elevation-2',
        'data-[state=closed]:animate-ui-layer-out data-[state=open]:animate-ui-layer-in',
        className,
      )}
      style={{ zIndex, ...style }}
      {...props}
    />
  );
});
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;
