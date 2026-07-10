/* eslint-disable react-refresh/only-export-components -- Drawer 需要按 Radix slot 形式导出复合组件。 */
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import { useOverlayZIndex, Z_BASE } from '../../../overlay/z-stack';
import { Button, type ButtonProps } from '../../general';

const DrawerOpenContext = React.createContext<boolean | undefined>(undefined);

export function Drawer({
  defaultOpen = false,
  onOpenChange,
  open,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>) {
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
    <DrawerOpenContext.Provider value={mergedOpen}>
      <DialogPrimitive.Root
        open={mergedOpen}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </DrawerOpenContext.Provider>
  );
}
Drawer.displayName = 'Drawer';

export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;

const drawerSizeClassName = {
  assist: 'w-[min(640px,100vw)]',
  form: 'w-[min(840px,100vw)]',
  detail: 'w-[70vw] min-w-[600px]',
  large: 'w-[min(880px,100vw)]',
  middle: 'w-[min(660px,100vw)]',
  small: 'w-[min(440px,100vw)]',
  full: 'w-screen',
} as const;

export const DrawerOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, style, ...props }, ref) => {
  const open = React.useContext(DrawerOpenContext);

  return (
    <DialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 bg-(--ui-overlay-subtle-background)',
        open === false ? 'animate-ui-fade-out' : 'animate-ui-fade-in',
        className,
      )}
      data-slot="drawer-overlay"
      ref={ref}
      style={{ animationFillMode: 'both', ...style }}
      {...props}
    />
  );
});
DrawerOverlay.displayName = DialogPrimitive.Overlay.displayName;

export interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  closeOnInteractOutside?: boolean;
  size?: keyof typeof drawerSizeClassName;
}

export const DrawerContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(
  (
    {
      className,
      children,
      closeOnInteractOutside = false,
      forceMount,
      onInteractOutside,
      onPointerDownOutside,
      size = 'detail',
      style,
      ...props
    },
    ref,
  ) => {
    const open = React.useContext(DrawerOpenContext);
    const [zIndex, layerRef] = useOverlayZIndex(Z_BASE.drawer, ref, open);
    const handleInteractOutside = React.useCallback<
      NonNullable<DrawerContentProps['onInteractOutside']>
    >(
      event => {
        onInteractOutside?.(event);

        if (!closeOnInteractOutside && !event.defaultPrevented) {
          event.preventDefault();
        }
      },
      [closeOnInteractOutside, onInteractOutside],
    );
    const handlePointerDownOutside = React.useCallback<
      NonNullable<DrawerContentProps['onPointerDownOutside']>
    >(
      event => {
        onPointerDownOutside?.(event);

        if (!closeOnInteractOutside && !event.defaultPrevented) {
          event.preventDefault();
        }
      },
      [closeOnInteractOutside, onPointerDownOutside],
    );

    return (
      <DialogPrimitive.Portal forceMount={forceMount}>
        <DrawerOverlay forceMount={forceMount} style={{ zIndex: zIndex - 1 }} />
        <DialogPrimitive.Content
          aria-modal="true"
          className={cn(
            'fixed inset-y-0 right-0 flex flex-col border-l border-ui-border bg-ui-background shadow-ui-elevation-5 outline-none',
            drawerSizeClassName[size],
            open === false
              ? 'animate-ui-drawer-right-out'
              : 'animate-ui-drawer-right-in',
            className,
          )}
          data-slot="drawer-content"
          data-drawer-size={size}
          forceMount={forceMount}
          onInteractOutside={handleInteractOutside}
          onPointerDownOutside={handlePointerDownOutside}
          ref={layerRef}
          style={{ animationFillMode: 'both', zIndex, ...style }}
          {...props}
        >
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  },
);
DrawerContent.displayName = DialogPrimitive.Content.displayName;

export function DrawerBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'min-h-0 flex-1 overflow-auto overscroll-contain px-5 py-4',
        className,
      )}
      data-slot="drawer-body"
      {...props}
    />
  );
}

export function DrawerHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex min-h-[52px] shrink-0 items-center justify-between gap-3 border-b border-ui-border px-5',
        className,
      )}
      data-slot="drawer-header"
      {...props}
    />
  );
}

export function DrawerFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'mt-auto flex shrink-0 justify-end gap-2 border-t border-ui-border px-5 py-3',
        className,
      )}
      data-slot="drawer-footer"
      {...props}
    />
  );
}

export const DrawerTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    className={cn('text-base font-semibold', className)}
    data-slot="drawer-title"
    ref={ref}
    {...props}
  />
));
DrawerTitle.displayName = DialogPrimitive.Title.displayName;

export const DrawerDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    className={cn('text-sm text-ui-muted-foreground', className)}
    data-slot="drawer-description"
    ref={ref}
    {...props}
  />
));
DrawerDescription.displayName = DialogPrimitive.Description.displayName;

export function DrawerCloseButton({
  className,
  size = 'small',
  variant = 'ghost',
  ...props
}: Omit<ButtonProps, 'children' | 'iconOnly'>) {
  return (
    <DrawerClose asChild>
      <Button
        aria-label="关闭抽屉"
        className={className}
        iconOnly
        size={size}
        variant={variant}
        {...props}
      >
        <X aria-hidden="true" className="size-4" />
      </Button>
    </DrawerClose>
  );
}
