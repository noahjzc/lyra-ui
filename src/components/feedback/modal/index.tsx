/* eslint-disable react-refresh/only-export-components -- Modal 需要按 Radix slot 形式导出复合组件。 */
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import { useOverlayZIndex, Z_BASE } from '../../../overlay/z-stack';
import { Button, type ButtonProps } from '../../general';

const ModalOpenContext = React.createContext<boolean | undefined>(undefined);

export function Modal({
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
    <ModalOpenContext.Provider value={mergedOpen}>
      <DialogPrimitive.Root
        open={mergedOpen}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </ModalOpenContext.Provider>
  );
}
Modal.displayName = 'Modal';

export const ModalTrigger = DialogPrimitive.Trigger;
export const ModalClose = DialogPrimitive.Close;

export interface ModalContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  closeOnInteractOutside?: boolean;
  loading?: boolean;
  size?: 'small' | 'middle' | 'large';
}

const modalSizeClassName = {
  large: 'w-[min(640px,calc(100vw-32px))]',
  middle: 'w-[min(520px,calc(100vw-32px))]',
  small: 'w-[min(400px,calc(100vw-32px))]',
} as const;

export const ModalOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, style, ...props }, ref) => (
  <DialogPrimitive.Overlay
    className={cn(
      'fixed inset-0 bg-(--ui-overlay-background) data-[state=closed]:animate-ui-fade-out data-[state=open]:animate-ui-fade-in',
      className,
    )}
    data-slot="modal-overlay"
    ref={ref}
    style={style}
    {...props}
  />
));
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

export const ModalContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(
  (
    {
      children,
      className,
      closeOnInteractOutside = false,
      loading = false,
      onInteractOutside,
      onPointerDownOutside,
      size = 'middle',
      style,
      ...props
    },
    ref,
  ) => {
    const open = React.useContext(ModalOpenContext);
    const [zIndex, layerRef] = useOverlayZIndex(Z_BASE.dialog, ref, open);
    const handleInteractOutside = React.useCallback<
      NonNullable<ModalContentProps['onInteractOutside']>
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
      NonNullable<ModalContentProps['onPointerDownOutside']>
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
      <DialogPrimitive.Portal>
        <ModalOverlay style={{ zIndex: zIndex - 1 }} />
        <DialogPrimitive.Content
          aria-busy={loading || undefined}
          aria-modal="true"
          className={cn(
            'fixed left-1/2 top-1/2 grid max-h-[calc(100vh-32px)] -translate-x-1/2 -translate-y-1/2 grid-rows-[auto_minmax(0,1fr)_auto] rounded-lg border border-ui-border bg-ui-background p-0 text-ui-foreground shadow-ui-elevation-6 outline-none data-[state=closed]:animate-ui-dialog-out data-[state=open]:animate-ui-dialog-in',
            modalSizeClassName[size],
            className,
          )}
          data-slot="modal-content"
          onInteractOutside={handleInteractOutside}
          onPointerDownOutside={handlePointerDownOutside}
          ref={layerRef}
          style={{ zIndex, ...style }}
          {...props}
        >
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  },
);
ModalContent.displayName = DialogPrimitive.Content.displayName;

export const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      'flex shrink-0 items-start justify-between gap-3 px-5 pt-5',
      className,
    )}
    data-slot="modal-header"
    ref={ref}
    {...props}
  />
));
ModalHeader.displayName = 'ModalHeader';

export const ModalBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      'min-h-0 overflow-auto overscroll-contain px-5 py-4',
      className,
    )}
    data-slot="modal-body"
    ref={ref}
    {...props}
  />
));
ModalBody.displayName = 'ModalBody';

export const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      'flex shrink-0 justify-end gap-2 border-ui-border border-t px-5 py-3',
      className,
    )}
    data-slot="modal-footer"
    ref={ref}
    {...props}
  />
));
ModalFooter.displayName = 'ModalFooter';

export const ModalTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    className={cn('text-base font-semibold', className)}
    data-slot="modal-title"
    ref={ref}
    {...props}
  />
));
ModalTitle.displayName = DialogPrimitive.Title.displayName;

export const ModalDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    className={cn('text-sm text-ui-muted-foreground', className)}
    data-slot="modal-description"
    ref={ref}
    {...props}
  />
));
ModalDescription.displayName = DialogPrimitive.Description.displayName;

export function ModalCloseButton({
  className,
  size = 'small',
  variant = 'ghost',
  ...props
}: Omit<ButtonProps, 'children' | 'iconOnly'>) {
  return (
    <ModalClose asChild>
      <Button
        aria-label="关闭弹窗"
        className={className}
        iconOnly
        size={size}
        variant={variant}
        {...props}
      >
        <X aria-hidden="true" className="size-4" />
      </Button>
    </ModalClose>
  );
}
