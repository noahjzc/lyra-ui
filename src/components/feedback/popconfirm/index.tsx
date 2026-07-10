import * as PopoverPrimitive from '@radix-ui/react-popover';
import { TriangleAlert } from 'lucide-react';
import * as React from 'react';
import { useOverlayZIndex, Z_BASE } from '../../../overlay/z-stack';
import type {
  PopoverArrowConfigProp,
  PopoverPlacement,
} from '../../data-view/popover/types';
import {
  getPopoverPlacementProps,
  popoverArrowClassName,
  popoverArrowFillPath,
  popoverArrowFillPathClassName,
  popoverArrowSize,
  popoverArrowStrokePath,
  popoverArrowStrokePathClassName,
  popoverLayerShadowStyle,
  shouldPointPopoverArrowAtCenter,
  shouldRenderPopoverArrow,
} from '../../data-view/popover/variants';
import { Button, type ButtonProps } from '../../general';

export interface PopconfirmProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root> {
  arrow?: PopoverArrowConfigProp;
  cancelText?: React.ReactNode;
  confirmText?: React.ReactNode;
  confirmVariant?: Extract<ButtonProps['variant'], 'primary' | 'danger'>;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  loading?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
  placement?: PopoverPlacement;
  showArrow?: boolean;
  showIcon?: boolean;
  title: React.ReactNode;
  trigger: React.ReactElement;
  variant?: 'default' | 'danger';
}

export function Popconfirm({
  arrow,
  cancelText = '取消',
  confirmText = '确认',
  confirmVariant,
  description,
  defaultOpen = false,
  icon,
  loading = false,
  onCancel,
  onConfirm,
  onOpenChange,
  open,
  placement = 'bottom',
  showArrow = true,
  showIcon = true,
  title,
  trigger,
  variant = 'default',
  ...props
}: PopconfirmProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = open != null;
  const mergedOpen = isControlled ? open : uncontrolledOpen;
  const titleId = React.useId();
  const descriptionId = React.useId();
  const [overlayZIndex, layerRef] = useOverlayZIndex<HTMLDivElement>(
    Z_BASE.popover,
    undefined,
    mergedOpen,
  );
  const confirmButtonVariant =
    confirmVariant ?? (variant === 'danger' ? 'danger' : 'primary');
  const placementProps = getPopoverPlacementProps(placement);
  const arrowVisible = shouldRenderPopoverArrow({ arrow, showArrow });
  const arrowPointAtCenter = shouldPointPopoverArrowAtCenter(arrow);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  const handleConfirm = React.useCallback(() => {
    onConfirm?.();

    if (!loading) {
      handleOpenChange(false);
    }
  }, [handleOpenChange, loading, onConfirm]);

  return (
    <PopoverPrimitive.Root
      open={mergedOpen}
      onOpenChange={handleOpenChange}
      {...props}
    >
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align={placementProps.align}
          aria-describedby={description == null ? undefined : descriptionId}
          aria-labelledby={titleId}
          className="grid w-[min(320px,calc(100vw-32px))] gap-3 rounded-lg border border-ui-border bg-ui-background p-3 text-ui-foreground outline-none data-[state=closed]:animate-ui-layer-out data-[state=open]:animate-ui-layer-in"
          collisionPadding={8}
          data-slot="popconfirm-content"
          ref={layerRef}
          role="dialog"
          side={placementProps.side}
          sideOffset={8}
          style={{ ...popoverLayerShadowStyle, zIndex: overlayZIndex }}
        >
          <div className="flex min-w-0 items-start gap-2.5">
            {showIcon && (
              <span
                className="mt-0.5 text-ui-warning"
                data-slot="popconfirm-icon"
              >
                {icon ?? (
                  <TriangleAlert aria-hidden="true" className="size-4" />
                )}
              </span>
            )}
            <div className="grid min-w-0 gap-1">
              <strong
                className="text-sm font-extrabold"
                data-slot="popconfirm-title"
                id={titleId}
              >
                {title}
              </strong>
              {description != null && (
                <div
                  className="text-ui-muted-foreground text-xs leading-5"
                  data-slot="popconfirm-description"
                  id={descriptionId}
                >
                  {description}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2" data-slot="popconfirm-footer">
            <PopoverPrimitive.Close asChild>
              <Button onClick={onCancel} size="small" variant="default">
                {cancelText}
              </Button>
            </PopoverPrimitive.Close>
            <Button
              loading={loading}
              onClick={handleConfirm}
              size="small"
              variant={confirmButtonVariant}
            >
              {confirmText}
            </Button>
          </div>
          {arrowVisible && (
            <PopoverPrimitive.Arrow
              asChild
              className={popoverArrowClassName}
              data-slot="popconfirm-arrow"
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
                  data-slot="popconfirm-arrow-fill"
                />
                <path
                  className={popoverArrowStrokePathClassName}
                  d={popoverArrowStrokePath}
                  data-slot="popconfirm-arrow-stroke"
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
    </PopoverPrimitive.Root>
  );
}
