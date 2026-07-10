import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
} from 'lucide-react';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../../internal/cn';
import { useOverlayZIndex, Z_BASE } from '../../../overlay/z-stack';
import { Button } from '../../general';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface NotificationProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  action?: React.ReactNode;
  closeLabel?: string;
  closable?: boolean;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  onClose?: () => void;
  title: React.ReactNode;
  type?: NotificationType;
}

const notificationIcon = {
  error: AlertCircle,
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
} as const;

const notificationTypeClassName = {
  error: 'text-ui-destructive',
  info: 'text-(--ui-button-primary-background)',
  success: 'text-ui-success',
  warning: 'text-ui-warning',
} as const;

const notificationLiveRegion = {
  error: { ariaLive: 'assertive', role: 'alert' },
  info: { ariaLive: 'polite', role: 'status' },
  success: { ariaLive: 'polite', role: 'status' },
  warning: { ariaLive: 'assertive', role: 'alert' },
} as const;

export const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
  (
    {
      action,
      className,
      closeLabel = '关闭通知',
      closable = false,
      description,
      meta,
      onClose,
      title,
      type = 'info',
      ...props
    },
    ref,
  ) => {
    const Icon = notificationIcon[type];
    const liveRegion = notificationLiveRegion[type];
    const showClose = closable || onClose != null;

    return (
      <div
        {...props}
        aria-live={liveRegion.ariaLive}
        className={cn(
          'pointer-events-auto grid w-[min(400px,calc(100vw-32px))] min-w-0 gap-3 rounded-md border border-ui-border bg-ui-background p-3 text-sm text-ui-foreground shadow-ui-elevation-4 animate-ui-layer-in motion-reduce:animate-none',
          className,
        )}
        data-slot="notification"
        ref={ref}
        role={liveRegion.role}
      >
        <div className="flex min-w-0 items-start gap-2.5">
          <Icon
            aria-hidden="true"
            className={cn(
              'mt-0.5 size-4 shrink-0',
              notificationTypeClassName[type],
            )}
            data-slot="notification-icon"
          />
          <div className="grid min-w-0 flex-1 gap-1">
            <div
              className="min-w-0 break-words font-semibold"
              data-slot="notification-title"
            >
              {title}
            </div>
            {description != null && (
              <div
                className="min-w-0 whitespace-normal break-words text-ui-muted-foreground"
                data-slot="notification-description"
              >
                {description}
              </div>
            )}
            {meta != null && (
              <div
                className="min-w-0 whitespace-normal break-words text-xs text-ui-muted-foreground"
                data-slot="notification-meta"
              >
                {meta}
              </div>
            )}
          </div>
          {showClose && (
            <Button
              aria-label={closeLabel}
              className="-mt-1 -mr-1 size-6"
              data-slot="notification-close"
              iconOnly
              onClick={onClose}
              size="small"
              variant="ghost"
            >
              <X aria-hidden="true" className="size-3.5" />
            </Button>
          )}
        </div>
        {action != null && (
          <div className="pl-6" data-slot="notification-action">
            {action}
          </div>
        )}
      </div>
    );
  },
);
Notification.displayName = 'Notification';

export const NotificationList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => {
  const [zIndex, layerRef] = useOverlayZIndex(Z_BASE.notification, ref, true);

  return createPortal(
    <div
      className={cn(
        'pointer-events-none fixed top-16 right-4 grid gap-2',
        className,
      )}
      data-slot="notification-viewport"
      ref={layerRef}
      style={{ zIndex, ...style }}
      {...props}
    />,
    document.body,
  );
});
NotificationList.displayName = 'NotificationList';
