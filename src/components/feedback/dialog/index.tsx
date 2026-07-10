/* eslint-disable react-refresh/only-export-components -- Dialog 需要按 Radix slot 形式导出复合组件。 */
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import { useOverlayZIndex, Z_BASE } from '../../../overlay/z-stack';
import { Button } from '../../general';

const DialogOpenContext = React.createContext<boolean | undefined>(undefined);

export function Dialog({
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
    <DialogOpenContext.Provider value={mergedOpen}>
      <DialogPrimitive.Root
        open={mergedOpen}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </DialogOpenContext.Provider>
  );
}
Dialog.displayName = 'Dialog';

export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, style, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 bg-(--ui-overlay-subtle-background) data-[state=closed]:animate-ui-fade-out data-[state=open]:animate-ui-fade-in',
      className,
    )}
    data-slot="dialog-overlay"
    style={style}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, style, ...props }, ref) => {
  const open = React.useContext(DialogOpenContext);
  const [zIndex, layerRef] = useOverlayZIndex(Z_BASE.dialog, ref, open);

  return (
    <DialogPrimitive.Portal>
      <DialogOverlay style={{ zIndex: zIndex - 1 }} />
      <DialogPrimitive.Content
        ref={layerRef}
        className={cn(
          'fixed left-1/2 top-1/2 w-[min(520px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-ui-border bg-ui-background p-5 text-ui-foreground shadow-ui-elevation-6 outline-none data-[state=closed]:animate-ui-dialog-out data-[state=open]:animate-ui-dialog-in',
          className,
        )}
        style={{ zIndex, ...style }}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('grid gap-1.5', className)} {...props} />;
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-5 flex justify-end gap-2', className)} {...props} />
  );
}

export const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-base font-semibold', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

export const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-ui-muted-foreground', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export function DialogCloseButton() {
  return (
    <DialogClose asChild>
      <Button aria-label="关闭" iconOnly variant="ghost">
        <X className="size-4" />
      </Button>
    </DialogClose>
  );
}
